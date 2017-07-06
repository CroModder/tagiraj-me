import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import 'rxjs/add/operator/map';

/*
  Generated class for the DatabaseService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class DatabaseService {

public db: SQLiteObject;

public constructor( platform: Platform, public sqlite: SQLite) {
    platform.ready().then(() => {
            
            sqlite.create({
                name: 'beta.db',
                location: 'default'
            }).then((db: SQLiteObject) => {
                this.db = db;
                this.createTables();
            }, (error) =>{
                console.log("Error: ", error);
            });
        
    });
}

async createTables(){
    try {
        await this.db.executeSql("PRAGMA foreign_keys = ON", []);
        await this.db.executeSql("CREATE TABLE IF NOT EXISTS tags (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT NOT NULL UNIQUE)", []);
        await this.db.executeSql("CREATE TABLE IF NOT EXISTS articles (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT NOT NULL UNIQUE, thumbnail TEXT, description TEXT, code TEXT UNIQUE)", []);
        await this.db.executeSql("CREATE TABLE IF NOT EXISTS tags_map (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, article_id INTEGER, tag_id INTEGER, FOREIGN KEY (article_id) REFERENCES articles (id), FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE RESTRICT)", []);
    }catch(e){
        console.log("Error !");
    }
}



public createArticle(name: string, thumbnail: string, description: string, code: string, tags) {
    return new Promise((resolve, reject) => {
        this.db.executeSql("INSERT INTO articles (name, thumbnail, description, code) VALUES (?, ?, ?, ?)", [name, thumbnail, description, code]).then((data) => {
            resolve(data);
            this.mapTags(data.insertId, tags)
        }, (error) => {
            reject(error);
        });
    });
}

public mapTags(id: number, tags ) {
    tags.map(tag => {
        this.db.executeSql("INSERT INTO tags_map (article_id, tag_id) VALUES (?, ?)", [id, tag]).catch((error) =>{
            console.log(error);
        });
    })
}

public readAllArticles() {
    return new Promise((resolve, reject) => {
        this.db.executeSql("SELECT * FROM articles", []).then((data) => {
            let articles = [];
            if(data.rows.length > 0) {
                for(let i = 0; i < data.rows.length; i++) {
                    articles.push({
                        id: data.rows.item(i).id,
                        name: data.rows.item(i).name,
                        thumbnail: data.rows.item(i).thumbnail,
                        description: data.rows.item(i).description,
                        code: data.rows.item(i).code
                    });
                }
            }
            resolve(articles);
        }, (error) => {
            reject(error);
        });
    });
}

public readArticle(id: number) {
    return new Promise((resolve, reject) => {
        this.db.executeSql("SELECT * FROM articles WHERE id = ?", [id]).then((data) => {
            let article:any = {};
            if(data.rows.length > 0) {
                for(let i = 0; i < data.rows.length; i++) {
                    article.id = data.rows.item(i).id,
                    article.name = data.rows.item(i).name,
                    article.thumbnail = data.rows.item(i).thumbnail,
                    article.description = data.rows.item(i).description,
                    article.code = data.rows.item(i).code
                }
            }
            resolve(article);
        }, (error) => {
            reject(error);
        });
    });
}

public readArticleByCode(code: string) {
    return new Promise((resolve, reject) => {
        this.db.executeSql("SELECT * FROM articles WHERE code = ?", [code]).then((data) => {
            let article:any = {};
            if(data.rows.length > 0) {
                for(let i = 0; i < data.rows.length; i++) {
                    article.id = data.rows.item(i).id,
                    article.name = data.rows.item(i).name,
                    article.thumbnail = data.rows.item(i).thumbnail,
                    article.description = data.rows.item(i).description,
                    article.code = data.rows.item(i).code
                }
            } else {
                reject("Artikl nije pronađen");
            }
            resolve(article);
        }, (error) => {
            reject(error);
        });
    });
}

public readArticleIdByTags(tags) {
    return new Promise((resolve, reject) => {
        let query = 'SELECT DISTINCT article_id FROM tags_map WHERE tag_id IN (' + tags.map(() => '?').join(',') + ')';
        this.db.executeSql(query, [...tags]).then((data) => {
            let article = [];
            if(data.rows.length > 0) {
                for(let i = 0; i < data.rows.length; i++) {
                    article.push(data.rows.item(i).article_id);
                }
            } else {
                reject("Nije pronađen nijedan artikl");
            }
            resolve(article);
        }, (error) => {
            reject(error);
        });
    });
}

public readArticleIdByKeywords(keywords) {
    return new Promise((resolve, reject) => {
        let query = "SELECT DISTINCT id FROM articles WHERE " + keywords.map(() => 'name LIKE ?').join(' OR ');
        let params = keywords.map((keyword) => `%${keyword}%`);
        this.db.executeSql(query, [...params]).then((data) => {
            let article = [];
            if(data.rows.length > 0) {
                for(let i = 0; i < data.rows.length; i++) {
                    article.push(data.rows.item(i).id);
                }
            } else {
                reject("Nije pronađen nijedan artikl");
            }
            resolve(article);
        }, (error) => {
            reject(error);
        });
    });
}

public readArticlebyId(ids) {
    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM articles WHERE id IN (' + ids.map(() => '?').join(',') + ')';
        this.db.executeSql(query, [...ids]).then((data) => {
            let articles = [];
            if(data.rows.length > 0) {
                for(let i = 0; i < data.rows.length; i++) {
                    articles.push({
                        id: data.rows.item(i).id,
                        name: data.rows.item(i).name,
                        thumbnail: data.rows.item(i).thumbnail,
                        description: data.rows.item(i).description,
                        code: data.rows.item(i).code
                    });
                }
            } else {
                reject("Artikl nije pronađen");
            }
            resolve(articles);
        }, (error) => {
            reject(error);
        });
    });
}

public articleTags(id: number) {
    return new Promise((resolve, reject) => {
        this.db.executeSql("SELECT tm.*, at.id, tt.name FROM tags_map tm INNER JOIN articles at on tm.article_id = at.id LEFT JOIN tags tt on tm.tag_id = tt.id WHERE tm.article_id = ?", [id]).then((data) => {
            let articleTags = [];
            if(data.rows.length > 0) {
                for(let i = 0; i < data.rows.length; i++) {
                    articleTags.push({
                        id: data.rows.item(i).tag_id,
                        name: data.rows.item(i).name
                    });
                }
            }
            resolve(articleTags);
        }, (error) => {
            reject(error);
        });
    });
}

public updateArticle(name: string, thumbnail: string, description: string, code: string, id: number, tags) {
    return new Promise((resolve, reject) => {
        this.db.executeSql("UPDATE articles SET name = ?, thumbnail = ?, description = ?, code = ? WHERE id = ?", [name, thumbnail, description, code, id]).then((data) => {
            this.deleteTagsMap(id);
            this.mapTags(id, tags);
            resolve(data);
        }, (error) => {
            reject(error);
        });
    });
}

public deleteArticle(id: number) {
    return this.deleteTagsMap(id)
    .then(() => this.deleteArticlebyId(id))
}

public deleteArticlebyId(id: number) {
    this.db.executeSql("DELETE FROM articles WHERE id = ?", [id]).then((result) => {   
        return result;
    }, (error) => {
        return error;
    });
}


public async createTag(name: string) {

        return new Promise((resolve,reject)=>{
        this.db.executeSql("INSERT INTO tags (name) VALUES (?)", [name]).then((data)=>{

            resolve(data);

        }).catch((e)=>{
            reject(e);
            console.log(e);
        });
    }); 


}

public readAllTags() {
    return new Promise((resolve, reject) => {
        this.db.executeSql("SELECT * FROM tags", []).then((data) => {
            let tags = [];
            if(data.rows.length > 0) {
                for(let i = 0; i < data.rows.length; i++) {
                    tags.push({
                        id: data.rows.item(i).id,
                        name: data.rows.item(i).name
                    });
                }
            }
            resolve(tags);
        }, (error) => {
            reject(error);
        });
    });
}

public updateTag(id: number, name: string) {
    return new Promise((resolve, reject) => {
        this.db.executeSql("UPDATE tags SET name = ? WHERE id = ?", [name, id]).then((data) => {
            resolve(data);
        }, (error) => {
            reject(error);
        });
    });
}

public deleteTag(id: number) {
    return new Promise((resolve, reject) => {
        this.db.executeSql("DELETE FROM tags WHERE id = ?", [id]).then((data) => {
            resolve(data);
        }, (error) => {
            reject(error);
        });
    });
}

public deleteTagsMap(id: number) {
    return new Promise((resolve, reject) => {
        this.db.executeSql("DELETE FROM tags_map WHERE article_id = ?", [id]).then((data) => {
           resolve(data);
        }, (error) => {
            reject(error);
        });
    });
}

 
}