import { Component } from '@angular/core';
import { createWorker } from 'tesseract.js';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import * as Tesseract from 'tesseract.js';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  worker: Tesseract.Worker | undefined;
  workerReady = false;
  image: Tesseract.ImageLike = 'https://tesseract.projectnaptha.com/img/eng_bw.png';
  ocrResult: string | undefined  = 'noch nichts erkannt';
  captureProgress = 0;

  constructor() {
    this.loadWorker();
  }

  async loadWorker() {
    this.worker = await createWorker({
      logger: progress => {
        if (progress.status == 'recognizing text') {
          this.captureProgress = parseInt('' + progress.progress * 100);
         }
        console.log(progress);
      }
    });

    (async () => {
      await this.worker?.loadLanguage('eng');
      await this.worker?.initialize('eng');
      this.workerReady = true;
    })();

  }

  async captureImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });

    this.image = image.dataUrl as Tesseract.ImageLike;
  }

  async recognizeImage() {
    const result = await this.worker?.recognize(this.image);
    this.ocrResult = result?.data.text;
  }
}
