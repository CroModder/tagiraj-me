import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { TagsSearchModal } from '../pages/home/tags-search';
import { KeywordsSearchModal } from '../pages/home/keywords-search';
import { ArticlesPage } from '../pages/articles/articles';
import { SingleArticle } from '../pages/articles/single-article';
import { NewArticle } from '../pages/articles/new-article';
import { EditArticle } from '../pages/articles/edit-article';
import { TagsPage } from '../pages/tags/tags';
import { NewTag } from '../pages/tags/new-tag';
import { EditTag } from '../pages/tags/edit-tag';

import { DatabaseService } from '../providers/database-service';
import { NfcService } from '../providers/nfc-service';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Camera } from '@ionic-native/camera';
import { SQLite } from '@ionic-native/sqlite';
import { NFC, Ndef } from '@ionic-native/nfc';


@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    HomePage,
    TagsSearchModal,
    KeywordsSearchModal,
    ArticlesPage,
    SingleArticle,
    EditArticle,
    NewArticle,
    TagsPage,
    NewTag,
    EditTag
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    HomePage,
    TagsSearchModal,
    KeywordsSearchModal,
    ArticlesPage,
    SingleArticle,
    EditArticle,
    NewArticle,
    TagsPage,
    NewTag,
    EditTag
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DatabaseService,
    NfcService,
    Camera,
    BarcodeScanner,
    SQLite,
    NFC,
    Ndef,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
