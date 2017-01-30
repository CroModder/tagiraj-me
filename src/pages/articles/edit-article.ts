import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { Camera } from 'ionic-native';
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

  constructor(public viewCtrl: ViewController, public params: NavParams, private database: DatabaseService ) {
    let article = params.get("article");
    let tagsObjectArray = params.get("tags");
    this.tagsNames = tagsObjectArray.map (tag => tag.name);
    this.tagsSelected = tagsObjectArray.map(tag => tag.id);
    console.log(this.tagsSelected);
    
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

  public editArticle() {
    console.log(this.tagsSelected);
    
    this.database.updateArticle(this.name, this.thumbnail, this.description, this.code, this.id, this.tagsSelected).then((result) => {
        this.dismiss();
    }, (error) => {
        console.log("ERROR: ", error);
    });
  }

  public dismiss() {
    this.viewCtrl.dismiss();
  }
}