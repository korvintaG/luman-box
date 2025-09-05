import request from 'supertest';

export const uploadPhoto = async (
    server: any,
    token: string,
    photo: string,
    expectedStatus = 201
  ) => {
    return request(server)
      .post(`/api/files/upload-image`)
      .set('Authorization', `Bearer ${token}`)
      .attach('image', photo)
      .expect(expectedStatus);
  };
  
  export const checkPhotoAbsent = async (
    server: any,
    photo: string,
    expectedStatus = 404
  ) => {
    return request(server)
      .get(`/dbimages/${photo}`)
      .expect(expectedStatus);
  };
  
  export const checkPhoto = async (
    server: any,
    photo: string,
    expectedStatus = 200
  ) => {
    //console.log('checkPhoto', photo);
    const res = await request(server)
      .get(`/dbimages/${photo}`)
      .buffer(true)
      .parse((res, callback) => {
        const data: Uint8Array[] = [];
        res.on('data', (chunk: Uint8Array) => data.push(chunk));
        res.on('end', () => callback(null, Buffer.concat(data)));
      })
      .expect(expectedStatus);
  
    const contentType = (res.headers['content-type'] || '') as string;
    if (!contentType.startsWith('image/')) {
      throw new Error(`Полученный файл не является изображением. content-type: ${contentType}`);
    }
  
    const contentLengthHeader = res.headers['content-length'];
    const contentLength = contentLengthHeader ? Number(contentLengthHeader) : res.body?.length;
    if (contentLength === undefined || !(contentLength > 0)) {
      throw new Error('Контент изображения пустой (content-length = 0)');
    }
  
    const buf: Buffer | undefined = res.body as Buffer | undefined;
    if (!buf || buf.length < 8) {
      throw new Error('Недостаточно данных для проверки изображения');
    }
  
    const isPng = (b: Buffer) => b.length >= 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4E && b[3] === 0x47 && b[4] === 0x0D && b[5] === 0x0A && b[6] === 0x1A && b[7] === 0x0A;
    const isJpeg = (b: Buffer) => b.length >= 4 && b[0] === 0xFF && b[1] === 0xD8 && b[b.length - 2] === 0xFF && b[b.length - 1] === 0xD9;
    const isGif = (b: Buffer) => b.length >= 6 && b.slice(0, 6).toString('ascii')?.match(/^GIF8[79]a$/);
  
    const looksLikeImage = isPng(buf) || isJpeg(buf) || isGif(buf as Buffer);
    if (!looksLikeImage) {
      throw new Error('Файл не соответствует сигнатурам PNG/JPEG/GIF');
    }
  
    return { contentType, contentLength };
  };