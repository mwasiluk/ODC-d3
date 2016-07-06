import {Utils} from './utils'


export class D3Extensions{

    static extend(){
        d3.selection.enter.prototype.selectOrAppend =
            d3.selection.prototype.selectOrAppend = function(selector) {
                return Utils.selectOrAppend(this, selector);
            };
    }
}
