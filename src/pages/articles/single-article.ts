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
    this.init();
  }

  public init(){
    this.readArticle(this.id);
    this.database.articleTags(this.id).then((result) => {
      this.tags = <Array<Object>> result;
    }, (error) => {
        console.log("ERROR: ", error);
    });
  }

  public openModalEdit() {
    let modal = this.modalCtrl.create(EditArticle, {article: this.article, tags: this.tags});
    modal.present();
    modal.onDidDismiss(data => {
     this.init();
    });
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
      let alert = this.alertCtrl.create({title: "from deleteArticle success", message: JSON.stringify(result), buttons: [{text: 'Zatvori'}]});
      alert.present(); 
      this.dismiss();
    }, (error) => {
        let alert = this.alertCtrl.create({title: "from deleteArticle error", message: JSON.stringify(error), buttons: [{text: 'Zatvori'}]});
        alert.present(); 
    });
  }

  public writeNFC() {
    this.nfc.writeNFC(this.code);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}