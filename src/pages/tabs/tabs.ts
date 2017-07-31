import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { ArticlesPage } from '../articles/articles';
import { TagsPage } from '../tags/tags';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  homeRoot: any = HomePage;
  articlesRoot: any = ArticlesPage;
  tagsRoot: any = TagsPage;

  constructor() {

  }
}
