if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI:'mongodb://sanket.gajera:University2016!@ds163781.mlab.com:63781/videojot_prod'}
}else{
    module.exports={mongoURI:'mongodb://localhost/vidjot-dev'}
}