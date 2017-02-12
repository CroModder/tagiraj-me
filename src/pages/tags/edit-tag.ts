import { Component } from '@angular/core';
import { NavParams, ViewController, AlertController } from 'ionic-angular';
import { DatabaseService } from "../../providers/database-service";

@Component({
  selector: 'edit-tag',
  templateUrl: 'edit-tag.html'
})

export class EditTag {
  public id: number;
  public name: string;
  public tag: any;

  constructor(public viewCtrl: ViewController,  public alertCtrl: AlertController, public params: NavParams, private database: DatabaseService ) {
    this.tag = params.get("tag");
    this.name = this.tag.name;
    this.id = this.tag.id;
  }

  deleteTagAlert() {
    let confirm = this.alertCtrl.create({
      title: 'Brisanje oznake',
      buttons: [
        {
          text: 'Obriši',
          handler: () => {
            this.deleteTag();
          }
        },
        {
          text: 'Odustani'
        }
      ]
    });
    confirm.present();
  }

  public updateTag() {
    if (this.name == "") {
      let msg = this.alertCtrl.create({title: 'Ime oznake ne smije biti prazno!', buttons: [{text: 'Zatvori'}]});
      msg.present();
    } else {
        this.database.updateTag(this.id, this.name).then((result) => {
            this.dismiss();
        }, (error) => {
            let msg = this.alertCtrl.create({title: 'Ime oznake već postoji!', buttons: [{text: 'Zatvori'}]});
            msg.present();
        });
    }
  }

  public deleteTag() {
    this.database.deleteTag(this.id).then((result) => {
        this.dismiss();
    }, (error) => {
        let confirm = this.alertCtrl.create({
          title: "Greška prilikom brisanja!",
          message: "Nije moguće obrisati oznaku koja je pridružena nekom artiklu.",
          buttons: [
            {
              text: 'Zatvori'
            }
          ]
        });
        confirm.present(); 
    });
  }

  public dismiss() {
    this.viewCtrl.dismiss();
  }
}