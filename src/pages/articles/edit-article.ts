import { Component } from '@angular/core';
import { NavParams, ViewController, AlertController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { DatabaseService } from "../../providers/database-service";

@Component({
  selector: 'edit-article',
  templateUrl: 'edit-article.html'
})

export class EditArticle {
  public id: number;
  public name: string;
  public thumbnail: string;
  public description: string;
  public code: string;
  public tags: any;
  public tagsSelected: Array<any>;
  public tagsNames: any;

  constructor(public viewCtrl: ViewController, private alertCtrl: AlertController, public params: NavParams, private database: DatabaseService, private camera: Camera) {
    let article = params.get("article");
    let tagsObjectArray = params.get("tags");
    this.tagsNames = tagsObjectArray.map (tag => tag.name);
    this.tagsSelected = tagsObjectArray.map(tag => tag.id);
    
    this.id = article.id;
    this.name = article.name;
    this.thumbnail = article.thumbnail;
    this.description = article.description;
    this.code = article.code;

    this.database.readAllTags().then((result) => {
        this.filterTags(result);
    }, (error) => {
        console.log("ERROR: ", error);
    });

  }

   public filterTags(allTags) {
    this.tags = allTags.map(val => {
        if (this.tagsNames.includes(val.name)) {
          return {name: val.name, selected: true, id: val.id};
        } else {
          return {name: val.name, selected: false, id: val.id};
        }
    });
   }

  public takePicture() {
    let options = {saveToPhotoAlbum: true };
    this.camera.getPicture(options).then((imageData) => {
      this.thumbnail = imageData;
      }, (err) => {
      console.log(err);
    });
  }

  public selectFromGallery() {
    let options = {
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,    
      encodingType: this.camera.EncodingType.JPEG,      
      correctOrientation: true
    };
    this.camera.getPicture(options).then((imageData) => {
        this.thumbnail = imageData;
    }, (err) => {
        console.log(err);
    });
    
  }

  public editArticle() {
    if (this.name == "") {
      let msg = this.alertCtrl.create({title: 'Ime artikla ne smije biti prazno!', buttons: [{text: 'Zatvori'}]});
      msg.present();
    } else {    
        this.database.updateArticle(this.name, this.thumbnail, this.description, this.code, this.id, this.tagsSelected).then((result) => {
            this.dismiss();
        }, (error) => {
            let msg = this.alertCtrl.create({title: 'Ime artikla već postoji!', buttons: [{text: 'Zatvori'}]});
            msg.present();
        });
    }
  }

  public dismiss() {
    this.viewCtrl.dismiss();
  }
}