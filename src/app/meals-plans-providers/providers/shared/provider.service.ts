import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';

import { HttpManager } from '../../../shared/http.manager';

import { ProviderModel } from './provider.model';
import { FullProviderModel } from './full-provider.model';
import { RecipeModel } from '../../../recipes/shared/recipe.model';
import { PlanModel } from '../../plans/shared/plan.model';

@Injectable()
export class ProviderService {
    endpoint = 'providers';
    httpManager: HttpManager;

    constructor(httpManager: HttpManager) {
        this.httpManager = httpManager;
    }

    /**
     * Get 4 providers
     * 
     * @returns {Promise<ProviderModel[]>}
     * 
     * @memberOf ProviderService
     */
    getProviders(): Promise<ProviderModel[]> {
        return this.httpManager.getAll(this.endpoint)
            .map(this.listOfProviders)
            .toPromise();
    }

    /**
     * Get Data specific provider
     * 
     * @param {Number} id
     * @returns {Promise<ProviderModel>}
     * 
     * @memberOf ProviderService
     */
    getSpecificProvider(id: Number): Promise<FullProviderModel> {
        return this.httpManager.get(this.endpoint, id)
            .map((provider: any) => {
                return new FullProviderModel(
                            provider.user.id, 
                            provider.user.username, 
                            provider.job, 
                            provider.picture,
                            provider.description);
            })
            .toPromise();
    }

    /**
     * Casting method, GetProviders
     */
    private listOfProviders(list: any): ProviderModel[] {
        return list.map(provider => {
           return new ProviderModel(provider.user.id, provider.user.username, provider.job, provider.picture);
        });
    }

}