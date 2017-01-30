import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { DatabaseService } from "../../providers/database-service";

@Component({
  selector: 'new-tag',
  templateUrl: 'new-tag.html'
})

export class NewTag {
  public name: string;

  constructor(public viewCtrl: ViewController, public params: NavParams, private database: DatabaseService ) {
    this.name = "";
  }

  public createTag() {
    this.database.createTag(this.name).then((result) => {
        this.dismiss();
    }, (error) => {
        console.log("ERROR: ", error);
    });
  }

  public dismiss() {
    this.viewCtrl.dismiss();
  }
}