import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { StorageService } from './storage.service';

@Injectable()
export class HttpManager {
  defaultRequestOptions: RequestOptionsArgs;
  baseEndpoint = 'http://homecook.pt/api';
  // baseEndpoint = 'http://localhost:80/api';

  constructor(public http: Http, public storageService: StorageService) {

    this.defaultRequestOptions = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }

  /**
   * Facade method to get an entity
   * 
   * @param {String} url
   * @param {Number} id
   * @param {RequestOptions} [options={}]
   * @returns {Observable<Response>}
   * 
   * @memberOf HttpManager
   */
  get(url: String, id: Number, options: RequestOptions = new RequestOptions()): Observable<Response> {
    options = this.prepareHttpRequest(options);

    return this.http.get(`${this.baseEndpoint}/${url}/${id}`, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  /**
   * Facade method to get a set of entities
   * 
   * @param {String} url
   * @param {RequestOptions} [options={}]
   * @returns {Observable<Response>}
   * 
   * @memberOf HttpManager
   */
  getAll(url: String, options: RequestOptions = new RequestOptions()): Observable<Response> {
    options = this.prepareHttpRequest(options);
    
    return this.http.get(`${this.baseEndpoint}/${url}`, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  /**
   * Facade method to post an entity
   * 
   * @param {String} url
   * @param {*} body
   * @param {RequestOptions} [options={}]
   * @returns {Observable<Response>}
   * 
   * @memberOf HttpManager
   */
  post(url: String, body: any, options: RequestOptions = new RequestOptions()): Observable<Response> {
    options = this.prepareHttpRequest(options);

    return this.http.post(`${this.baseEndpoint}/${url}`, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  /**
   * Facade method to put an entity
   * 
   * @param {String} url
   * @param {Number} id
   * @param {*} body
   * @param {RequestOptions} [options={}]
   * @returns {Observable<Response>}
   * 
   * @memberOf HttpManager
   */
  put(url: String, id: Number, body: any, options: RequestOptions = new RequestOptions()): Observable<Response> {
    options = this.prepareHttpRequest(options);

    return this.http.put(`${this.baseEndpoint}/${url}/${id}`, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  /**
   * Facade method to patch an entity
   * 
   * @param {String} url
   * @param {Number} id
   * @param {*} body
   * @param {RequestOptions} [options={}]
   * @returns {Observable<Response>}
   * 
   * @memberOf HttpManager
   */
  patch(url: String, id: Number, body: any, options: RequestOptions = new RequestOptions()): Observable<Response> {
    options = this.prepareHttpRequest(options);

    return this.http.patch(`${this.baseEndpoint}/${url}/${id}`, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  /**
   * Facade method to put a set of entities
   * 
   * @param {String} url
   * @param {*} body
   * @param {RequestOptions} [options={}]
   * @returns {Observable<Response>}
   * 
   * @memberOf HttpManager
   */
  putAll(url: String, body: any, options: RequestOptions = new RequestOptions()): Observable<Response> {
    options = this.prepareHttpRequest(options);

    return this.http.put(`${this.baseEndpoint}/${url}`, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  /**
   * Facade method to delete an entity
   * 
   * @param {String} url
   * @param {Number} id
   * @param {RequestOptions} [options={}]
   * @returns {Observable<Response>}
   * 
   * @memberOf HttpManager
   */
  delete(url: String, id: Number, options: RequestOptions = new RequestOptions()): Observable<Response> {
    options = this.prepareHttpRequest(options);
    
    return this.http.delete(`${this.baseEndpoint}/${url}/${id}`, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private prepareHttpRequest(options: RequestOptions): RequestOptions {
    if(!options.headers) {
      options.headers = new Headers();
    }

    this.defaultRequestOptions.headers.keys().forEach(key => {
      if(!options.headers.has(key)) {
        options.headers.append(key, this.defaultRequestOptions.headers.get(key));
      }
    })

    if(this.storageService.token) {
      options.headers.set('token', this.storageService.token)
    }

    return options;
  }

  /**
   * 
   * 
   * @private
   * @param {Response} response
   * @returns
   * 
   * @memberOf HttpManager
   */
  private extractData(response: Response) {
    return response.json();
  }

  /**
   * 
   * 
   * @private
   * @param {(Response | any)} error
   * @returns
   * 
   * @memberOf HttpManager
   */
  private handleError(error: Response | any) {
    // (tbragaf, 01/12/2016): Transform error to HttpError
    return Observable.throw(error);
  }

}