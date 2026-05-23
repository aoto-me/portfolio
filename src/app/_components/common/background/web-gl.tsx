'use client';

import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import styles from './background.module.scss';

const WebGl = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    let renderer: THREE.WebGLRenderer;
    let manager: THREE.LoadingManager;
    let pixelRatio = 1;
    let width = 0;
    let height = 0;
    let ready = false;

    // Three.jsシーン構成
    let scene: THREE.Scene;
    let camera: THREE.OrthographicCamera;
    let stage: THREE.Group;

    // 背景画像＋ノイズエフェクト
    const plane = {
      geometry: undefined as THREE.PlaneGeometry | undefined,
      material: undefined as THREE.ShaderMaterial | undefined,
      mesh: undefined as THREE.Mesh | undefined,
      src: '/img/bg.jpg',
      texture: undefined as THREE.Texture | undefined,
    };

    // 星
    const stars = {
      geometry: undefined as THREE.BufferGeometry | undefined,
      material: undefined as THREE.ShaderMaterial | undefined,
      mesh: undefined as THREE.Points | undefined,
    };

    /**
     * 平面（背景）を作る
     */
    // Description : Array and textureless GLSL 2D/3D/4D simplex
    //               noise functions.
    //      Author : Ian McEwan, Ashima Arts.
    //  Maintainer : stegu
    //     Lastmod : 20201014 (stegu)
    //     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
    //               Distributed under the MIT License. See LICENSE file.
    //               https://github.com/ashima/webgl-noise
    //               https://github.com/stegu/webgl-noise
    const addPlane = () => {
      // 幅1×高さ1の平面を作成（あとで画面サイズに拡大する）
      plane.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

      plane.material = new THREE.ShaderMaterial({
        // ピクセルの色を決めるシェーダー
        fragmentShader: `
          // ノイズ生成
          vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }
          vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
          vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

          // 3次元 Simplex Noise
          float simplexNoise(vec3 v) {
            const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
            const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

            vec3 i = floor(v + dot(v, C.yyy));
            vec3 x0 = v - i + dot(i, C.xxx);
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min(g.xyz, l.zxy);
            vec3 i2 = max(g.xyz, l.zxy);

            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy;
            vec3 x3 = x0 - D.yyy;

            i = mod289(i);
            vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0)) +
              i.y + vec4(0.0, i1.y, i2.y, 1.0)) +
              i.x + vec4(0.0, i1.x, i2.x, 1.0));

            float n_ = 0.142857142857;
            vec3 ns = n_ * D.wyz - D.xzx;
            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_);
            vec4 x = x_ * ns.x + ns.yyyy;
            vec4 y = y_ * ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);

            vec4 b0 = vec4(x.xy, y.xy);
            vec4 b1 = vec4(x.zw, y.zw);
            vec4 s0 = floor(b0) * 2.0 + 1.0;
            vec4 s1 = floor(b1) * 2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));

            vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
            vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

            vec3 p0 = vec3(a0.xy, h.x);
            vec3 p1 = vec3(a0.zw, h.y);
            vec3 p2 = vec3(a1.xy, h.z);
            vec3 p3 = vec3(a1.zw, h.w);

            vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
            p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

            vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
            m = m * m;
            return 85.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
          }

          // シェーダーメイン部分
          uniform sampler2D tDiffuse; // 背景画像
          varying vec2 vUv;           // ピクセル位置のUV座標（0〜1）
          uniform float time;         // 経過時間
          uniform float width;        // ノイズ空間のXスケール
          uniform float height;       // ノイズ空間のYスケール
          uniform float speed;        // 動く速さ

          void main() {
            // 時間と座標からノイズ値を生成
            float n = simplexNoise(vec3(vUv.x * width, vUv.y * height, time * speed * 0.01));
            // ずらしたUVからテクスチャ色を取得して描画
            gl_FragColor = texture2D(tDiffuse, vUv + vec2(0.5 * n));
          }
        `,
        side: THREE.DoubleSide, // 両面描画
        transparent: true, // 透明許可
        // JavaScriptからGLSLへ渡す変数（シェーダー内で使う変数）
        uniforms: {
          height: { value: 1 },
          resolution: { value: new THREE.Vector2(width * pixelRatio, height * pixelRatio) },
          speed: { value: 0.1 },
          tDiffuse: { value: plane.texture },
          time: { value: 0 },
          width: { value: 1 },
        },
        // 頂点の位置を決めるシェーダー
        vertexShader: `
        varying vec2 vUv; // 頂点の位置をそのまま使う
        void main() {
          vUv = uv; // 頂点のUVをそのままフラグメントへ渡す
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      });

      // geometry + material ⇒ meshを作成
      plane.mesh = new THREE.Mesh(plane.geometry, plane.material);
      // 画面サイズに合わせて拡大
      plane.mesh.scale.set(width, height, 1);
      // シーンに追加
      stage.add(plane.mesh);
    };

    /**
     * 星を作る
     */
    const addStars = () => {
      const COUNT = 120;

      // 星ごとの位置とシード値を格納する配列
      const positions = new Float32Array(COUNT * 3);
      const seeds = new Float32Array(COUNT);

      for (let i = 0; i < COUNT; i++) {
        // 位置をNDC座標（-1〜1）で指定
        // ⇒ カメラ行列を使わずに画面全体に均等配置できる
        positions[i * 3] = (Math.random() - 0.5) * 2;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 2;
        positions[i * 3 + 2] = 0;
        // 星ごとに異なるシード値を持たせ、瞬きのタイミング・速さ・明るさをバラけさせる
        seeds[i] = Math.random() * 100;
      }

      stars.geometry = new THREE.BufferGeometry();
      stars.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      stars.geometry.setAttribute('seed', new THREE.BufferAttribute(seeds, 1));

      stars.material = new THREE.ShaderMaterial({
        // 背景より手前に必ず描画されるよう深度テストを無効化
        depthTest: false,
        depthWrite: false,
        fragmentShader: `
          uniform float time;
          varying float vSeed;
          varying float vSize;
          varying float vBrightness;
          void main() {
            vec2 center = gl_PointCoord - 0.5; // 点の中心を原点にする

            // 瞬き(星ごとにスピードを変える)
            float speed = 0.008 + fract(vSeed * 0.07) * 0.04;
            float t = time * speed;
            // sinの谷（負の部分）だけ取り出してクランプ（ふだんは明るく、たまにパッと消える）
            float raw = max(0.0, -sin(t + vSeed));
            float dip = clamp(raw * 2.0, 0.0, 1.0);
            float twinkle = 1.0 - dip;

            // 形状(中心から広がる丸い光)
            float dist = length(center) * 2.0;
            float glow = exp(-dist * dist * 5.0);

            // 水平・垂直の光芒（十字形状）
            float spike_h = exp(-center.y * center.y * 120.0) * exp(-center.x * center.x * 6.0);
            float spike_v = exp(-center.x * center.x * 120.0) * exp(-center.y * center.y * 6.0);
            float sparkle = glow + (spike_h + spike_v) * 0.7;

            // vBrightness で星ごとの最大輝度を変える（遠い星・近い星の差）
            gl_FragColor = vec4(1.0, 1.0, 1.0, clamp(sparkle, 0.0, 1.0) * twinkle * vBrightness);
          }
        `,
        transparent: true,
        uniforms: {
          time: { value: 0 },
        },
        vertexShader: `
          attribute float seed;
          varying float vSeed;
          varying float vSize;
          varying float vBrightness;
          void main() {
            vSeed = seed;
            vSize = mix(1.0, 12.0, fract(seed * 0.17)); // サイズを1〜12pxでランダム
            vBrightness = mix(0.35, 1.0, fract(seed * 0.31)); // 最大輝度を0.35〜1.0でランダム
            // NDC座標をそのままクリップ空間に渡す（カメラ変換をスキップ）
            gl_Position = vec4(position.xy, 0.0, 1.0);
            gl_PointSize = vSize;
          }
        `,
      });

      // meshを作成
      stars.mesh = new THREE.Points(stars.geometry, stars.material);
      // シーンに追加
      stage.add(stars.mesh);
    };

    /**
     * シーンを初期化
     */
    const initScene = () => {
      scene = new THREE.Scene();

      // 正射影カメラ（遠近感のない平面投影）
      camera = new THREE.OrthographicCamera(-width / 4, width / 4, height / 4, -height / 4, 0.1, 1000);
      camera.position.z = 1;

      stage = new THREE.Group();
      scene.add(camera);
      scene.add(stage);

      addPlane();
      addStars();
      renderer.render(scene, camera); // animate()が始まる前に最初の1フレームだけ手動で描画
    };

    /**
     * 毎フレーム更新（アニメーション）
     */
    const updateScene = () => {
      if (plane.material) {
        (plane.material.uniforms.time.value as number) += 0.5;
      }
      if (stars.material) {
        (stars.material.uniforms.time.value as number) += 0.5;
      }
    };

    const animate = () => {
      if (ready) {
        updateScene();
        renderer.render(scene, camera); // 再描画
        requestAnimationFrame(animate); // 次のフレーム
      }
    };

    /**
     * WebGLレンダラー初期化
     */
    const initWebGL = (canvas: HTMLCanvasElement) => {
      width = window.innerWidth;
      height = window.outerHeight;
      pixelRatio = Math.min(window.devicePixelRatio, 1.2);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas,
      });
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height);

      // アセット読み込み完了後に実行される処理の予約
      manager = new THREE.LoadingManager();
      manager.onLoad = () => {
        initScene();
        ready = true;
        animate();
        setLoad(true);
      };
    };

    /**
     * 画像の読み込み
     */
    const loadAssets = () => {
      const loader = new THREE.TextureLoader(manager); // initWebGL内でmanagerインスタンスを生成済み

      // 背景画像を読み込み、plane.textureにセット
      loader.load(plane.src, texture => {
        plane.texture = texture;
      });
    };

    /**
     * リサイズ対応
     */
    const resizeWebGL = () => {
      width = window.innerWidth;
      height = window.outerHeight;

      renderer.setSize(width, height);

      camera.left = -width / 4;
      camera.right = width / 4;
      camera.top = height / 4;
      camera.bottom = -height / 4;
      camera.updateProjectionMatrix();

      if (plane.mesh) {
        plane.mesh.scale.set(width, height, 1);
      }
    };

    /**
     * 実行
     */
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    // WebGLの描画先（canvas + renderer）が先、その後でtextureを読み込む
    initWebGL(canvas); // WebGLの初期化
    loadAssets(); // 画像読み込み開始
    window.addEventListener('resize', resizeWebGL);

    return () => {
      window.removeEventListener('resize', resizeWebGL);
      plane.geometry?.dispose();
      plane.material?.dispose();
      plane.texture?.dispose();
      stars.geometry?.dispose();
      stars.material?.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas className={clsx(styles.canvas, load && styles.isLoad)} ref={canvasRef} />;
};

export default WebGl;
