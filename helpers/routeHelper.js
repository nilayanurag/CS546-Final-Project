

export async function routeValidationHelper(...args){

    if (!args || args.length===0){
        throw "Internal function error: in routeValidationHelper "
    }

    const requiredFunction=args[0];

    if (typeof requiredFunction !== 'function') {
        throw "Internal function error:First argument must be a function";
    }

    const functionArgs = args.slice(1);

    try{
        const result = await requiredFunction.apply(null, functionArgs);
        return [result,undefined]
    }catch(error){
        return [undefined,error]
    }

}
    