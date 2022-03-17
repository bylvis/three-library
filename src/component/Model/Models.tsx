import * as THREE from 'three'

const CreatPlane = () => {
    const Plane = new THREE.BoxGeometry(2000,2000,20)
    const material = new THREE.MeshLambertMaterial({
        color:'#cccccc'
    })
    const Mesh = new THREE.Mesh(Plane,material)
    return Mesh
}
export var BASIC_PLANE = CreatPlane()