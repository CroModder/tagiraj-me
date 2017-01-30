import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { SingleArticle } from './single-article';
import { NewArticle } from './new-article';
import { DatabaseService } from "../../providers/database-service";

@Component({
  selector: 'page-articles',
  templateUrl: 'articles.html'
})
export class ArticlesPage {

  public articles: Array<Object>;

  public constructor(public modalCtrl: ModalController, private database: DatabaseService ) {
    this.articles = [];
  }

  ionViewWillEnter(){
    this.readAllArticles();
  }

  public openModalSingle(id: number) { 
    let modal = this.modalCtrl.create(SingleArticle, {id: id});
    modal.present();
    modal.onDidDismiss(data => {
        this.readAllArticles();
    });
  }

  public openModalNew() {
    let modal = this.modalCtrl.create(NewArticle);
    modal.present();
    modal.onDidDismiss(data => {
     this.readAllArticles();
    });
  }

  public readAllArticles() {
    this.database.readAllArticles().then((result) => {
          this.articles = <Array<Object>> result;
      }, (error) => {
          console.log("ERROR: ", error);
      });
  }

}