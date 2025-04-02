import * as PIXI from 'pixi.js'

const vertexShader = `
attribute vec2 aVertexPosition;
uniform mat3 projectionMatrix;
varying vec2 vTextureCoord;
uniform vec4 outputFrame;

vec4 filterVertexPosition(void ) {
  vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.0)) + outputFrame.xy;
  return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);
}

void main(void ) {
  gl_Position = filterVertexPosition();
  vTextureCoord = aVertexPosition;
}
`
const fragmentPerspectiveShader = `
varying vec2 vTextureCoord;
uniform sampler2D depthMap;
uniform sampler2D uSampler;
uniform vec3 offset;
uniform float focus;
const float enlarge = 1.06;

vec3 perspective(
  vec2 uv
) {
  const int step_count = 25; 

  vec3 ray_origin = vec3(uv - 0.5, 0); 
  ray_origin.xy -= offset.xy * focus;

  vec3 ray_direction = vec3(0, 0, 1); 
  ray_direction.xy += offset.xy;
  ray_direction /= float(step_count);

  const float hit_threshold = 0.01;
  
  vec4 color = vec4(0.0);
  for (int i = 0; i < step_count; i++) {
    ray_origin += ray_direction;
    float scene_z = 1.0 - texture2D(depthMap, ray_origin.xy + 0.5).x;
    if (ray_origin.z > scene_z) {
      if (ray_origin.z - scene_z < hit_threshold) {
        break;
      }
      ray_origin -= ray_direction; 
      ray_direction /= 2.0; 
    }
  }
  color = texture2D(uSampler, ray_origin.xy + 0.5);
  return color.rgb;
}

void main(void ) {
  vec2 uv = (vTextureCoord - vec2(0.5)) / vec2(enlarge) + vec2(0.5);
  gl_FragColor = vec4(
    perspective(uv),
    1.0
  );
}
`

const fragmentDilationShader = `
varying vec2 vFilterCoord;
varying vec2 vTextureCoord;
uniform float widthPx;
uniform float heightPx;
uniform float dilation;
uniform sampler2D uSampler;
const int MAX_RADIUS = 10;

float dilate(vec2 uv, vec2 px) {
  float maxValue = 0.0;
  float minValue = 1.0;
  for (int x = -MAX_RADIUS; x <= +MAX_RADIUS; x++) {
    for (int y = -MAX_RADIUS; y <= +MAX_RADIUS; y++) {
      vec2 offset = vec2(float(x), float(y));
      if (length(offset) > float(MAX_RADIUS)) continue;
      offset *= px;
      vec2 uv2 = uv + offset;
      float val = texture2D(uSampler, uv2).x;
      maxValue = max(val, maxValue);
      minValue = min(val, minValue);
    }
  }
  return dilation < 0.0
    ? minValue
    : maxValue;
}

void main(void ) {
  const float dilationScale = 1.26; 
  float dilationStep = abs(dilationScale * dilation) / float(MAX_RADIUS);
  float aspect = widthPx / heightPx;
  vec2 px =
    widthPx > heightPx
      ? vec2(dilationStep / aspect, dilationStep)
      : vec2(dilationStep, dilationStep * aspect);
  gl_FragColor = vec4(vec3(dilate(vTextureCoord, px)), 1.0);
}
`


export class Perspective {
  app = new PIXI.Application
  dragging = false
  initialOrientation = {
    alpha: 0,
    beta: 0,
    gamma: 0
  }
  constructor(){
    document.body.appendChild(this.app.view);
    this.handleEvent()
  }
  async loadTexture(img,depth){
    this.texture = await PIXI.Texture.fromURL(img);
    const depthTexture = await PIXI.Texture.fromURL(depth)
    
    this.width=this.texture.width
    this.height=this.texture.height
    this.app.renderer.resize(this.width, this.height);

    const dilationFilter = new PIXI.Filter(vertexShader, fragmentDilationShader, {
      widthPx: this.width,
      heightPx: this.height,
      dilation: 0.002
    });
    const depthSprite = new PIXI.Sprite(depthTexture);
    depthSprite.filters = [dilationFilter];
    const renderTexture = PIXI.RenderTexture.create({
      width:this.width,
      height:this.height
    });
    this.app.renderer.render(depthSprite, {renderTexture:renderTexture});

    if(this.sprite){
      this.app.stage.removeChild(this.sprite);
    }

    this.sprite = new PIXI.Sprite(this.texture);
    this.paralaxFilter = new PIXI.Filter(vertexShader, fragmentPerspectiveShader, {
      depthMap: renderTexture,
      offset: [0.0, 0.0, 0.0],
      focus: 0.5
    });
    this.sprite.filters = [this.paralaxFilter];
    this.app.stage.addChild(this.sprite);
  }
  handleEvent(){
    this.app.view.addEventListener('pointermove', (e) => {
      if(!this.paralaxFilter){
        return
      }
      this.dragging = true;
      const relX = (e.clientX / this.app.renderer.width) * 2 - 1;
      const relY = (e.clientY / this.app.renderer.height) * 2 - 1;
  
      const rat=0.05
      
      this.paralaxFilter.uniforms.offset = [relX * rat, relY * rat, 0.0];
    });
    this.app.view.addEventListener('pointerup', () => {
      this.dragging = false;
    });
    this.requestOrientationPermission()
  }
  requestOrientationPermission(){
    // 针对iOS 13+需要请求权限
    if (typeof DeviceOrientationEvent !== 'undefined' && 
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then((permissionState) => {
          if (permissionState === 'granted') {
            this.enableOrientationControl();
          }
        })
        .catch(console.error);
    } else {
      // 其他设备直接启用
      this.enableOrientationControl();
    }
  }
  enableOrientationControl(){
    window.addEventListener('deviceorientation', this.handleDeviceOrientation.bind(this));
    
    // 记录初始方向作为参考点
    window.addEventListener('deviceorientation', (event) => {
      this.initialOrientation.alpha = event.alpha || 0;
      this.initialOrientation.beta = event.beta || 0;
      this.initialOrientation.gamma = event.gamma || 0;
    }, { once: true });
  }
  handleDeviceOrientation(event){
    if(this.dragging||!this.paralaxFilter) {
      return
    };
    // 获取设备的旋转角度
    const alpha = event.alpha || 0;  // 绕z轴旋转角度
    const beta = event.beta || 0;    // 绕x轴旋转角度
    const gamma = event.gamma || 0;  // 绕y轴旋转角度
    // 计算相对于初始方向的偏移
    const deltaBeta = beta - this.initialOrientation.beta;
    const deltaGamma = gamma - this.initialOrientation.gamma;
    
    // 应用旋转角度
    this.paralaxFilter.uniforms.offset = [
      deltaGamma * 0.002,
      deltaBeta * 0.002,
      0.0
    ];
  }
}