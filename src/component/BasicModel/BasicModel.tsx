import React, { useEffect, useState } from "react";
import * as THREE from 'three'
import { OrbitControls } from '@three-ts/orbit-controls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { BOOK_TEXTURE_MATERIAL, BOOK_CHOSE_MATERIAL } from "../Texture/Texture";
import { BASIC_PLANE } from "../Model/Models";
import { BOOK_LIST } from "../Data/data";
import { DrawerRight } from "../Drawer/Drawer";
import './BasicModel.css'
import MyContext from "../Context/myContext";

const BasicModel = () => {
    var scene: any
    var camera: any
    var renderer: any
    var pointLight: any
    var ambient: any
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    var [rightOpen, set_rightOpen] = useState(false)
    var [bookList, set_bookList] = useState({})
    var controls: any = null
    let moveForward = false;
    let moveBackward = false;
    let moveLeft = false;
    let moveRight = false;
    let canJump = false;
    let prevTime = performance.now();
    const direction = new THREE.Vector3();
    const velocity = new THREE.Vector3();
    const objects: any = [];
    
    useEffect(() => {
        initThree()
        initScene()
        initCamera()
        initRender()
        initPoint()
        initModel()
        initPointerLockControls()
        runRender()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    // 初始化
    const initThree = () => {
        console.log('init three');
        // console.log(BOOK_LIST.data);
        // initPointerLockControls()
    }
    // 初始化场景
    const initScene = () => {
        const canvas = document.querySelector('canvas')
        if (canvas) {
            canvas.parentNode?.removeChild(canvas)
        }
        scene = new THREE.Scene()
        scene.add(new THREE.AxesHelper(2000));//添加辅助坐标轴

    }
    // 初始化摄像机
    const initCamera = () => {
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000)
        camera.position.set(200, 200, 200); //设置相机位置
        camera.lookAt(scene.position);
        scene.add(BASIC_PLANE)
        BASIC_PLANE.rotateX(Math.PI / 2);
        controls = new PointerLockControls(camera, document.body);
    }
    // 初始化指针锁定控制器
    const initPointerLockControls = () => {
        const blocker = document.getElementById('blocker');
        const instructions = document.getElementById('instructions');
        if (blocker && controls) {
            instructions!.addEventListener('click', function () {
                controls.lock();
            });
            controls.addEventListener('lock', function () {
                instructions!.style.display = 'none';
                blocker!.style.display = 'none';
            });
            controls.addEventListener('unlock', function () {
                blocker!.style.display = 'block';
                instructions!.style.display = '';
            });
        }
        scene.add(controls.getObject());
        const onKeyDown = (event: any) => {
            console.log(event.code);

            switch (event.code) {

                case 'ArrowUp':
                case 'KeyW':
                    moveForward = true;
                    break;

                case 'ArrowLeft':
                case 'KeyA':
                    moveLeft = true;
                    break;

                case 'ArrowDown':
                case 'KeyS':
                    moveBackward = true;
                    break;

                case 'ArrowRight':
                case 'KeyD':
                    moveRight = true;
                    break;

                case 'Space':
                    if (canJump === true) velocity.y += 350;
                    canJump = false;
                    break;

            }

        };

        const onKeyUp = (event: any) => {

            switch (event.code) {

                case 'ArrowUp':
                case 'KeyW':
                    moveForward = false;
                    break;

                case 'ArrowLeft':
                case 'KeyA':
                    moveLeft = false;
                    break;

                case 'ArrowDown':
                case 'KeyS':
                    moveBackward = false;
                    break;

                case 'ArrowRight':
                case 'KeyD':
                    moveRight = false;
                    break;

            }

        };

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);


    }
    // 初始化渲染器
    const initRender = () => {
        renderer = new THREE.WebGLRenderer()
        renderer.setClearColor(0xb9d3ff, 1);// 设置颜色
        renderer.setSize(window.innerWidth, window.innerHeight)// 设置尺寸
        document.body.appendChild(renderer.domElement);// 往body里面追加render的dom元素
        document.querySelector('.Scene')?.appendChild(renderer.domElement)
    }
    // 初始化光源
    const initPoint = () => {
        // 4.创建光源 点光源以及环境光
        pointLight = new THREE.PointLight(0xffffff);// 创建点光源 没有点光源 模型无法反射光 所以是黑的
        pointLight.position.set(700, 500, 700);// 设置光源位置
        scene.add(pointLight);// 创建环境光 没有环境光模型可以显示 但是会比较暗
        var pointLight2 = new THREE.PointLight(0xffffff);// 创建点光源 没有点光源 模型无法反射光 所以是黑的
        pointLight2.position.set(-700, 500, -700);// 设置光源位置
        scene.add(pointLight2);// 创建环境光 没有环境光模型可以显示 但是会比较暗
        var sphereSize = 20;
        var pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
        scene.add(pointLightHelper);
        var pointLightHelper2 = new THREE.PointLightHelper(pointLight2, sphereSize);
        scene.add(pointLightHelper, pointLightHelper2);
        ambient = new THREE.AmbientLight(0x444444);
        scene.add(ambient);
        // 聚光光源
        var spotLight = new THREE.SpotLight(0xffffff);
        // / 设置聚光光源位置
        spotLight.position.set(0, 1500, 0);
        // 聚光灯光源指向网格模型mesh2
        spotLight.target = BASIC_PLANE;
        spotLight.distance = 1500
        // 设置聚光光源发散角度
        spotLight.angle = Math.PI / 6
        scene.add(spotLight);//光对象添加到scene场景中
        var spotLightHelper = new THREE.SpotLightHelper(spotLight);
        scene.add(spotLightHelper);
    }
    // 初始化模型
    const initModel = () => {
        var model = loadShelfModel()
        // 异步通信
        setTimeout(() => {
            // 最终是 10个书架 5排书 每一排23本书
            for (var j = 0; j < 5; j++) {
                for (var i = 0; i < 23; i++) {
                    model.children[0].children[j].children[i].userData = BOOK_LIST.data[i * (j + 1)]
                }
            }

        }, 300)
        console.log(BOOK_LIST.length);




        scene.add(model)
    }

    // 加载模型方法
    const loadShelfModel = () => {
        var loader = new OBJLoader();
        // 书+书架组
        var bookShelfGroup = new THREE.Group()

        loader.load('./library.obj', (obj) => {
            // 控制台查看返回结构：包含一个网格模型Mesh的组Group
            obj.children.forEach((i: any) => {
                i.material = BOOK_TEXTURE_MATERIAL
            })
            for (var i = 0; i < 2; i++) {
                for (var j = 0; j < 5; j++) {
                    var bookShelfGroup = new THREE.Group()
                    bookShelfGroup.add(obj.clone())
                    bookShelfGroup.translateX(-700 + 150 * i)
                    bookShelfGroup.translateZ(-600 + 300 * j)
                    scene.add(bookShelfGroup)
                }
            }

        })

        loader.load('./book.obj', function (obj) {
            // 书组
            var bookGroup = new THREE.Group()
            var books = new THREE.Group()
            obj.children.forEach((i: any) => {
                i.material = BOOK_TEXTURE_MATERIAL
            })
            // 控制台查看返回结构：包含一个网格模型Mesh的组Group
            // 创建一排书 共计23本
            for (var i = 0; i < 23; i++) {
                var objcopy = obj.clone()
                objcopy.position.set(-55 + 5 * i, 180, -20)
                objcopy.scale.set(1.5, 1.5, 1.5)
                // 现在bookGroup里面装了23本书
                books.add(objcopy)
            }
            // 调整书的位置 创建五排书
            var item = books.clone()

            var item1 = books.clone()
            item1.translateY(-36)
            var item2 = books.clone()
            item2.translateY(-80)
            var item3 = books.clone()
            item3.translateY(-116)
            var item4 = books.clone()
            item4.translateY(-156)
            bookGroup.add(item, item1, item2, item3, item4)
            bookGroup.translateZ(-600)
            bookGroup.translateX(-700)

            // 五排书构成一个group 两个循环构成一个矩阵
            for (var k = 0; k < 2; k++) {
                for (var l = 0; l < 5; l++) {
                    var bookGroupClone = bookGroup.clone()
                    bookGroupClone.translateX(150 * k)
                    bookGroupClone.translateZ(300 * l)
                    bookShelfGroup.add(bookGroupClone)
                }
            }
        })
        return bookShelfGroup
    }
    // 不断纠正换算鼠标的坐标
    const onMouseMove = (event: any) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    }
    // 添加鼠标移动事件不断计算射线
    window.addEventListener('pointermove', onMouseMove, false);
    var intersects: any
    // 计算射线
    const initRaycaster = () => {

        raycaster.setFromCamera(mouse, camera);
        intersects = raycaster.intersectObjects(scene.children);
        // console.log(intersects);
    }
    // 点击书 书变色
    const clickBook = () => {
        /*
            点击book 显示bookid
         */
        if (intersects) {
            if (intersects.length > 0 && intersects[0].object.name === 'Poems') {
                // 射线射到的是材质对象 材质对象的上级是书
                set_rightOpen(true)
                console.log(intersects[0].object.parent.userData);
                console.log(intersects[0].object.id);
                set_bookList(intersects[0].object.parent.userData)
                if (intersects[0].object.material === BOOK_TEXTURE_MATERIAL) {
                    intersects[0].object.material = BOOK_CHOSE_MATERIAL
                } else {
                    intersects[0].object.material = BOOK_TEXTURE_MATERIAL
                }

            }
        }
    }
    window.addEventListener('click', clickBook)
    // 开始渲染
    const runRender = () => {
        function render() {
            initRaycaster()
            renderer.render(scene, camera)
            requestAnimationFrame(render)
            const time = performance.now();
            // console.log(controls.isLocked);
            if (controls.isLocked === true) {

                raycaster.ray.origin.copy(controls.getObject().position);
                raycaster.ray.origin.y -= 100;

                const intersections = raycaster.intersectObjects(objects, false);

                const onObject = intersections.length > 0;

                const delta = (time - prevTime) / 1000;

                velocity.x -= velocity.x * 10.0 * delta;
                velocity.z -= velocity.z * 10.0 * delta;

                velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

                direction.z = Number(moveForward) - Number(moveBackward);
                direction.x = Number(moveRight) - Number(moveLeft);
                direction.normalize(); // this ensures consistent movements in all directions

                if (moveForward || moveBackward) velocity.z -= direction.z * 2400.0 * delta;
                if (moveLeft || moveRight) velocity.x -= direction.x * 2400.0 * delta;

                if (onObject === true) {

                    velocity.y = Math.max(0, velocity.y);
                    canJump = true;

                }

                controls.moveRight(- velocity.x * delta);
                controls.moveForward(- velocity.z * delta);

                controls.getObject().position.y += (velocity.y * delta); // new behavior

                if (controls.getObject().position.y < 140) {

                    velocity.y = 0;
                    controls.getObject().position.y = 140;

                    canJump = true;

                }

            }

            prevTime = time;

        }
        window.onresize = function () {
            // 重置渲染器输出画布canvas尺寸
            renderer.setSize(window.innerWidth, window.innerHeight);
            // 全屏情况下：设置观察范围长宽比aspect为窗口宽高比
            camera.aspect = window.innerWidth / window.innerHeight;
            // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
            // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
            // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
            camera.updateProjectionMatrix();
        };

        render()
        new OrbitControls(camera, renderer.domElement);//创建控件对象
    }

    return (
        <div>
            <MyContext.Provider value={{ rightOpen, bookList }}>
                <DrawerRight setParent={set_rightOpen}></DrawerRight>
                <div className="Scene">
                    <div id="blocker">
                        <div id="instructions">
                            <p >
                                Click to play
                            </p>
                            <p>
                                Move: WASD<br />
                                Jump: SPACE<br />
                                Look: MOUSE
                            </p>
                        </div>
                    </div>
                </div>
            </MyContext.Provider>

        </div>
    )
}
export default BasicModel