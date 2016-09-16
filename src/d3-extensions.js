import {Utils} from './utils'


export class D3Extensions{

    static extend(){

        d3.selection.prototype.enter.prototype.insertSelector =
            d3.selection.prototype.insertSelector = function(selector, before) {
                return Utils.insertSelector(this, selector, before);
            };


        d3.selection.prototype.enter.prototype.appendSelector =
            d3.selection.prototype.appendSelector = function(selector) {
                return Utils.appendSelector(this, selector);
            };

        d3.selection.prototype.enter.prototype.selectOrAppend =
            d3.selection.prototype.selectOrAppend = function(selector) {
                return Utils.selectOrAppend(this, selector);
            };

        d3.selection.prototype.enter.prototype.selectOrInsert =
            d3.selection.prototype.selectOrInsert = function(selector, before) {
                return Utils.selectOrInsert(this, selector, before);
            };



    }
}
