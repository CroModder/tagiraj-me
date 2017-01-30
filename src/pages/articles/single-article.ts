import { Component } from '@angular/core';
import { NavParams, ViewController, AlertController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { EditArticle } from './edit-article';
import { DatabaseService } from "../../providers/database-service";
import { NfcService } from "../../providers/nfc-service";

@Component({
  selector: 'single-article',
  templateUrl: 'single-article.html'
})

export class SingleArticle {
  public tags: any;
  public article: any;
  public id: number;
  public name: string;
  public thumbnail: string;
  public description: string;
  public code: string;


  constructor(public modalCtrl: ModalController, public viewCtrl: ViewController,  public params: NavParams, private nfc: NfcService, private database: DatabaseService, public alertCtrl: AlertController ) {
    this.id = this.params.get("id");
    this.readArticle(this.id);
    database.articleTags(this.id).then((result) => {
      this.tags = <Array<Object>> result;
    }, (error) => {
        console.log("ERROR: ", error);
    });
  }

  public openModalEdit() {
    let modal = this.modalCtrl.create(EditArticle, {article: this.article, tags: this.tags});
    modal.present();
  }

  public readArticle(id: number) {
    this.database.readArticle(id).then((result) => {
      this.article = Object.assign({}, result);
      this.name = this.article.name;
      this.thumbnail = this.article.thumbnail;
      this.description = this.article.description;
      this.code = this.article.code;
    }, (error) => {
        console.log("ERROR: ", error);
    });
  }

  deleteArticleAlert() {
    let confirm = this.alertCtrl.create({
      title: 'Brisanje artikla',
      buttons: [
        {
          text: 'Obriši',
          handler: () => {
            this.deleteArticle(this.id);
          }
        },
        {
          text: 'Odustani'
        }
      ]
    });
    confirm.present();
  }

  public deleteArticle(id: number) {
    this.database.deleteArticle(id).then((result) => {
      this.dismiss();
    }, (error) => {
        console.log("ERROR: ", error);
    });
  }

  public writeNFC() {
    this.nfc.writeNFC(this.code);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}