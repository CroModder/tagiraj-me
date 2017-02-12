import { Component } from '@angular/core';
import { NavParams, ViewController, AlertController } from 'ionic-angular';
import { Camera } from 'ionic-native';
import { DatabaseService } from "../../providers/database-service";

@Component({
  selector: 'new-article',
  templateUrl: 'new-article.html'
})

export class NewArticle { 
  public name: string;
  public thumbnail: string;
  public description: string;
  public code: string;
  public tags: any;
  public tagsSelected: Array<any> = [];

  constructor(public viewCtrl: ViewController, private alertCtrl: AlertController, public params: NavParams, private database: DatabaseService ) {
    this.name = "";
    this.thumbnail = "";
    this.description = "";
    this.code = params.get("code");
    this.database.readAllTags().then((result) => {
        this.tags = <Array<Object>> result;
    }, (error) => {
        console.log("ERROR: ", error);
    });
  }

  public takePicture() {
    let options = {saveToPhotoAlbum: true };
    Camera.getPicture(options).then((imageData) => {
      this.thumbnail = imageData;
      }, (err) => {
      console.log(err);
    });
  }

  public selectFromGallery() {
    let options = {
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: Camera.DestinationType.FILE_URI,    
      encodingType: Camera.EncodingType.JPEG,      
      correctOrientation: true
    };
    Camera.getPicture(options).then((imageData) => {
        this.thumbnail = imageData;
    }, (err) => {
        console.log(err);
    });
    
  }

  public createArticle() {
    if (this.name == "") {
      let msg = this.alertCtrl.create({title: 'Ime artikla ne smije biti prazno!'});
      msg.present();
    } else {
        this.database.createArticle(this.name, this.thumbnail, this.description, this.code, this.tagsSelected).then((result) => {
          console.log(result);
          console.log(JSON.stringify(result));
            this.dismiss();
        }, (error) => {
            console.log("ERROR: ", error);
        });
    }
  }

  public dismiss() {
    this.viewCtrl.dismiss();
  }
}