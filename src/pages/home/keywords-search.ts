import { Component } from '@angular/core';
import { NavParams, ViewController, ModalController, AlertController } from 'ionic-angular';
import { SingleArticle } from '../articles/single-article';
import { DatabaseService } from "../../providers/database-service";

@Component({
  selector: 'keywords-search',
  templateUrl: 'keywords-search.html'
})

export class KeywordsSearchModal {
  public keywords: string;
  public articles: Array<Object>;

  constructor(public modalCtrl: ModalController, public viewCtrl: ViewController, public alertCtrl: AlertController,  public params: NavParams, private database: DatabaseService) {
  }

  public filterByTags() {
    this.articles = [];
    this.database.readArticleIdByKeywords(this.keywords.split(" ")).then((result) => {
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