import * as THREE from 'three'
const loadTexture = (name: string) => {
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load(name)
    return texture
}
var BOOK_TEXTURE = loadTexture('./texture.jpg')
BOOK_TEXTURE.wrapS = THREE.RepeatWrapping;
BOOK_TEXTURE.wrapT = THREE.RepeatWrapping;
// texture.offset = new THREE.Vector2(0.3, 0.1)
// uv两个方向纹理重复数量
BOOK_TEXTURE.repeat.set(1, 10);
export var BOOK_TEXTURE_MATERIAL = new THREE.MeshLambertMaterial({
    // color: 0x0000ff,
    // 设置颜色纹理贴图：Texture对象作为材质map属性的属性值
    map: BOOK_TEXTURE,//设置颜色贴图属性值
}); //材质对象Material

export var BOOK_CHOSE_MATERIAL = new THREE.MeshLambertMaterial({
    color: 'skyblue',//设置颜色贴图属性值
}); //材质对象Material

