import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { NewTag } from './new-tag';
import { EditTag } from './edit-tag';
import { DatabaseService } from "../../providers/database-service";

@Component({
  selector: 'page-tags',
  templateUrl: 'tags.html'
})
export class TagsPage {

  public tags: Array<Object>;
  public name: string;
  public id: number;

  public constructor(public modalCtrl: ModalController, private database: DatabaseService ) {
    this.tags = [];
  }

  ionViewDidEnter() {
    this.readAllTags();
  }

  public editTag(tag) {
    let modal = this.modalCtrl.create(EditTag, {tag: tag});
    modal.present();
    modal.onDidDismiss(data => {
     this.readAllTags();
    });
  }

  public openModalNew() {
    let modal = this.modalCtrl.create(NewTag);
    modal.present();
    modal.onDidDismiss(data => {
     this.readAllTags();
    });
  }

  public readAllTags() {
     this.database.readAllTags().then((result) => {
          this.tags = <Array<Object>> result;         
      }, (error) => {
          console.log("ERROR: ", error);
      });
  }

  public deleteTag(id: number) {
      this.database.deleteTag(id).then((result) => {
          this.readAllTags();
      }, (error) => {
          console.log("ERROR: ", error);
      });
  }

}