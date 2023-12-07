import * as commentFunction from '../../data/comments.js';

try{

    const comment = await commentFunction.updateComment('657163731fcf8c5c5fccdca7','6571617dce82f11f99dfc76a','65715f0bf610d8cfce920ec7','This is a test comment-2')
    console.log('Test 1 Passed',comment);
}catch(error){
    throw error;
}

try {
    const comment = await commentFunction.getCommentById('657163731fcf8c5c5fccdca7');
    console.log('Test 2 Passed',comment);
    
} catch (error) {
    throw error;
    
}
