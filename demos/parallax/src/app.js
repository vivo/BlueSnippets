import {Perspective} from './perspective.js'
import {depthEstimator} from './depthEstimator.js'
import './style.css'

const loading=document.getElementById('loading')

// 缩放图片的辅助函数
const scaleImage = (imageUrl, maxWidth) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // 如果图片宽度小于指定宽度，直接使用原图
      if (img.width <= maxWidth) {
        resolve(imageUrl);
        return;
      }
      
      // 计算缩放比例
      const scale = maxWidth / img.width;
      const newHeight = Math.floor(img.height * scale);
      
      // 创建canvas进行绘制
      const canvas = document.createElement('canvas');
      canvas.width = maxWidth;
      canvas.height = newHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, maxWidth, newHeight);
      
      // 转换为Blob URL
      canvas.toBlob((blob) => {
        const scaledUrl = URL.createObjectURL(blob);
        resolve(scaledUrl);
      }, 'image/jpeg', 0.9); // 压缩质量可调整
    };
    
    img.onerror = () => reject(new Error('Image scaling failed'));
    img.src = imageUrl;
  });
};

const app=new Perspective()
app.loadTexture('https://img.vivo.com.cn/sloth/a/i/1b5196bdf3ca_c.png','https://img.vivo.com.cn/sloth/a/i/7959e54cb38f_c.png')

const fileInput=document.getElementById('change-file')
fileInput.addEventListener('click',async function(e){
  const input=document.createElement('input')
  input.type='file'
  input.accept='image/*'
  input.click()
  input.addEventListener('change',async function(e){
    const file = e.target.files[0]
    const url = URL.createObjectURL(file)
    loading.style.display='block'
    // 缩放图片至指定宽度
    const maxWidth = 1024 // 设置最大宽度，可根据需求调整
    const scaledImageUrl = await scaleImage(url, maxWidth)

    const depth=await depthEstimator(scaledImageUrl)
    await app.loadTexture(scaledImageUrl,depth)
    loading.style.display='none'
  })
})