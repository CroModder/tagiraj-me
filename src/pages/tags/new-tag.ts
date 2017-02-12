import { Component } from '@angular/core';
import { NavParams, ViewController, AlertController } from 'ionic-angular';
import { DatabaseService } from "../../providers/database-service";

@Component({
  selector: 'new-tag',
  templateUrl: 'new-tag.html'
})

export class NewTag {
  public name: string;

  constructor(public viewCtrl: ViewController, private alertCtrl: AlertController, public params: NavParams, private database: DatabaseService ) {
    this.name = "";
  }

  public createTag() {
    if (this.name == "") {
      let msg = this.alertCtrl.create({title: 'Ime oznake ne smije biti prazno!'});
      msg.present();
    } else {
        this.database.createTag(this.name).then((result) => {
            this.dismiss();
        }, (error) => {
            console.log("ERROR: ", error);
        });
    }
  }

  public dismiss() {
    this.viewCtrl.dismiss();
  }
}