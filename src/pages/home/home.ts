import { Component } from '@angular/core';
import { ModalController, NavController, AlertController, Platform, Events } from 'ionic-angular';
import { BarcodeScanner } from 'ionic-native';
import { SingleArticle } from '../articles/single-article';
import { NewArticle } from '../articles/new-article';
import { TagsSearchModal } from '../home/tags-search';
import { DatabaseService } from "../../providers/database-service";
import { NfcService } from "../../providers/nfc-service";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public result: any;
  public article: any;
  public code: string;
  private isSubscribed: boolean;

  constructor(
    public platform: Platform, 
    public modalCtrl: ModalController, 
    public alertCtrl: AlertController, 
    public navCtrl: NavController, 
    private database: DatabaseService, 
    public nfc: NfcService,
    public events: Events) {
  }

  ionViewWillEnter(){
    this.nfc.init();
    if(!this.isSubscribed) {
      this.events.subscribe('nfc:gotData', (code) => {
        this.code = code;
        this.findArticle(code);
      });
      this.events.subscribe('nfc:error', (error) => {
        let message = "NFC oznaka nije zapisana u formatu kojeg ova aplikacija prihvaća";
        this.tagFormatUnsupported(message);
      });
      this.isSubscribed = true;
    }
  }

  ionViewWillLeave() {
    this.nfc.removeNFCListener();
  }

  public scan() {
    BarcodeScanner.scan().then((barcodeData) => {
    if(barcodeData.cancelled == false) {
      this.code = barcodeData.text;
      this.findArticle(barcodeData.text);
    }
    }, (err) => {
        console.log(err);
    });
   
  }

  public findArticle(code: string) {
    this.database.readArticleByCode(code).then((result) => {
      this.article = Object.assign({}, result);
      this.openModalSingle(this.article.id);
    }, (error) => {
        this.codeNotFound(error);
    });
  }

  public codeNotFound(title) {
    let confirm = this.alertCtrl.create({
      title: title,
      message: "Želite li dodati novi artikl za skenirani kod?",
      buttons: [
        {
          text: 'Dodaj',
          handler: () => {
            let modal = this.modalCtrl.create(NewArticle, {code: this.code});
            console.log(this.code);
            modal.present();
          }
        },
        {
          text: 'Odustani'
        }
      ]
    });
    confirm.present();
  }

  public codeEntry() {
    let alert = this.alertCtrl.create({
      inputs: [
        {
          name: 'code',
          placeholder: 'Kod (šifra artikla)'
        }
      ],
      buttons: [
        {
          text: 'Potvrdi',
          handler: data => {
            this.findArticle(data.code);
          }
        },
        {text: 'Odustani'}
      ]
    });
    alert.present();
  }

  public filterByTags() {
    let modal = this.modalCtrl.create(TagsSearchModal);
    modal.present();
  }

  public tagFormatUnsupported(message) {
    let confirm = this.alertCtrl.create({
      message: message,
      buttons: [{text: 'Zatvori'}]
    });
    confirm.present();
  }

  public openModalSingle(id: number) { 
    let modal = this.modalCtrl.create(SingleArticle, {id: id});
    modal.present();
  }

}
