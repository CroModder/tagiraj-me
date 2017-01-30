import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { TagsSearchModal } from '../pages/home/tags-search';
import { ArticlesPage } from '../pages/articles/articles';
import { SingleArticle } from '../pages/articles/single-article';
import { NewArticle } from '../pages/articles/new-article';
import { EditArticle } from '../pages/articles/edit-article';
import { TagsPage } from '../pages/tags/tags';
import { NewTag } from '../pages/tags/new-tag';
import { EditTag } from '../pages/tags/edit-tag';
import { SettingsPage } from '../pages/settings/settings';
import { InfoPage } from '../pages/info/info';
import { DatabaseService } from '../providers/database-service';
import { NfcService } from '../providers/nfc-service';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    HomePage,
    TagsSearchModal,
    ArticlesPage,
    SingleArticle,
    EditArticle,
    NewArticle,
    TagsPage,
    NewTag,
    EditTag,
    SettingsPage,
    InfoPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    HomePage,
    TagsSearchModal,
    ArticlesPage,
    SingleArticle,
    EditArticle,
    NewArticle,
    TagsPage,
    NewTag,
    EditTag,
    SettingsPage,
    InfoPage
  ],
  providers: [DatabaseService, NfcService, {provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}