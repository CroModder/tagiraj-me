import { Component } from '@angular/core';
import { NavParams, ViewController, ModalController, AlertController } from 'ionic-angular';
import { SingleArticle } from '../articles/single-article';
import { DatabaseService } from "../../providers/database-service";
import { NfcService } from "../../providers/nfc-service";

@Component({
  selector: 'tags-search',
  templateUrl: 'tags-search.html'
})

export class TagsSearchModal {
  public articles: Array<Object>;
  public tags: any;
  public tagsSelected: Array<any> = [];

  constructor(public modalCtrl: ModalController, public viewCtrl: ViewController, public alertCtrl: AlertController,  public params: NavParams, private database: DatabaseService) {
    this.database.readAllTags().then((result) => {
        this.tags = <Array<Object>> result;
    }, (error) => {
        console.log("ERROR: ", error);
    });
  }

  public filterByTags() {
    this.articles = [];
    this.database.readArticleIdByTags(this.tagsSelected).then((result) => {
      this.showArticles(result);
    }, (error) => {
        let confirm = this.alertCtrl.create({
          message: error,
          buttons: [{text: 'U redu'}]
        });
        confirm.present();
        });
  }

  public showArticles(ids){
    this.database.readArticlebyId(ids).then((result) => {
          this.articles = <Array<Object>> result;
      }, (error) => {
          console.log("ERROR: ", error);
      });
  }

  public openModalSingle(id: number) { 
    let modal = this.modalCtrl.create(SingleArticle, {id: id});
    modal.present();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}