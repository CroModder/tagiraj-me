import { Injectable } from '@angular/core';
import { Platform, Events, AlertController } from 'ionic-angular';
import { NFC, Ndef } from '@ionic-native/nfc';
import 'rxjs/add/operator/map';

/*
  Generated class for the NfcService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class NfcService {
  private isOpen: boolean = false;
  public nfcListener: any;

public constructor( public platform: Platform, public alertCtrl: AlertController, public events: Events, private nfc: NFC, private ndef: Ndef) {
}

  public init () {
        this.platform.ready().then(() => {
        if(!this.isOpen) {
           this.nfc.enabled()
            .then(() => {
              this.addListenNFC();
              this.isOpen = true;
            })
            .catch(err => {
              if(err == "NFC_DISABLED") {
                this.showSettingsAlert();
              }
            });
        }
    });
  }

  public addListenNFC() {
    this.nfcListener = this.nfc.addNdefListener().subscribe(nfcData => {
      try {
        console.log(nfcData);
        
        let tag = nfcData.tag;
        let ndefMessage = tag.ndefMessage;
        let parsedNfcData = this.nfc.bytesToString(ndefMessage[0].payload);
        let code = parsedNfcData.substring(3);
        this.events.publish('nfc:gotData', code);
      } catch (error) {
        this.events.publish('nfc:error');
      }
    });
  }

  public removeNFCListener() {
    this.nfcListener.unsubscribe();
    this.isOpen = false;
  }

  public showSettingsAlert() {
    let alert = this.alertCtrl.create({
    subTitle : "NFC nije uključen",
    buttons: [
      { 
        text : "Postavke", handler : function() { this.nfc.showSettings() }
      },
      {
        text: 'Odustani'
      }
    ]
    });
    alert.present();
  }

  public writeNFC(code) {
    let message = this.ndef.textRecord(code);
    this.nfc.write([message]).then((result) => {
      console.log(result);
    }).catch((error) => {
      console.log(error);
    });
  }
  
}
