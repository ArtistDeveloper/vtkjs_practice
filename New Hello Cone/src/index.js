import "@kitware/vtk.js/Rendering/Profiles/Geometry"; // 다양한 프로필 클래스를 등록한다. 이 외에도 profiles에 여럿 사용가능한 프로필이 있다.
import "@kitware/vtk.js/Rendering/Misc/RenderingAPIs"; // WebGL와 WebGPU backends를 등록한다.

import vtkActor from "@kitware/vtk.js/Rendering/Core/Actor";
import vtkConeSource from "@kitware/vtk.js/Filters/Sources/ConeSource";
import vtkMapper from "@kitware/vtk.js/Rendering/Core/Mapper";
import vtkRenderer from "@kitware/vtk.js/Rendering/Core/Renderer";
import vtkRenderWindow from "@kitware/vtk.js/Rendering/Core/RenderWindow";
import vtkRenderWindowInteractor from "@kitware/vtk.js/Rendering/Core/RenderWindowInteractor";
import vtkInteractorStyleTrackballCamera from "@kitware/vtk.js/Interaction/Style/InteractorStyleTrackballCamera";


// 1. Create RenderWindow
// e1은 html element (웹에서 디버깅 해보기)
function createRenderWindow(e1) {
  // Renderwindow: renderer가 이미지를 그리기 위한 GUI 창이다.
  // rendering process 동기화, window size 설정, double buffering 조작에 사용된다.
  const renderWindow = vtkRenderWindow.newInstance();
  const renderer = vtkRenderer.newInstance();

  renderWindow.addRenderer(renderer);

  // picks webgl or webgpu
  // WebGL또는 WebGPu 구현은 실제 렌더링을 수행합니다.
  const apiSpecificRenderWindow = renderWindow.newAPISpecificView();
  apiSpecificRenderWindow.setContainer(e1);
  renderWindow.addView(apiSpecificRenderWindow);

  // Create interactor and bind
  const interactor = vtkRenderWindowInteractor.newInstance();
  interactor.setInteractorStyle(
    vtkInteractorStyleTrackballCamera.newInstance()
  );

  interactor.setView(apiSpecificRenderWindow);
  interactor.initialize();
  interactor.bindEvents(e1);

  apiSpecificRenderWindow.setSize(600, 600);

  return {
    renderWindow,
    renderer,
    interactor,
    apiSpecificRenderWindow
  };
}

const components = createRenderWindow(document.getElementById("app"));
const { renderer, renderWindow } = components;

// Sources and Filters
function createConePipeline() {
  // source는 일부 입력 매개변수들이 주어진 데이터를 생성한다.
  // https://github.com/Kitware/vtk-js/blob/master/Sources/Filters/Sources/ConeSource/index.js
  // 위 소스 코드를 살펴보면, point, triangle cells등이 모여있고 transformation 적용 내용도 들어가있다.
  // Filters: 필터는 입력을 transform하고 transform된 출력을 생성한다.
  // "필터"는 다른 구성 요소에서 데이터를 수신하고 어떤 방식으로든 데이터를 수정한 다음 수정된 데이터를 다른 구성 요소에서 사용할 출력으로 전달하는 VTK 구성 요소이다.
  // coneSource는 필터에 속한다.
  // https://docs.google.com/presentation/d/1NkdQbp0swGAp6YXVBAu8duGamicGS6VYj0EH2IQKLyQ/edit#slide=id.gf9ef662e49_0_235

  const coneSource = vtkConeSource.newInstance(); // 지정된 지점을 중심으로 지정된 방향을 가리키는 원뿔 생성
  const actor = vtkActor.newInstance();

  // vtkMapper는 데이터와 그래픽 프리미티브 간의 인터페이스를 지정하는 추상 클래스입니다. vtkMapper의 하위 클래스는 조회 테이블을 통해 데이터를 매핑하고,
  // 그래픽 라이브러리에 연결하는(인터페이스하는) 렌더링 프리미티브 생성을 제어합니다
  const mapper = vtkMapper.newInstance();

  actor.setMapper(mapper);
  mapper.setInputConnection(coneSource.getOutputPort());

  renderer.addActor(actor);
  return { coneSource, mapper, actor };
}

const pipeline = createConePipeline();
pipeline.actor.getProperty().setColor(1, 0, 1);

renderer.resetCamera();
renderWindow.render();

global.cone = pipeline.coneSource.getOutputData();





