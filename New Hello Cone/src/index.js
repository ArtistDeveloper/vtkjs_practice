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
function createRenderWindow(el) {
  const renderWindow = vtkRenderWindow.newInstance();
  const renderer = vtkRenderer.newInstance();

  renderWindow.addRenderer(renderer);

  // picks webgl or webgpu
  const apiSpecificRenderWindow = renderWindow.newAPISpecificView();
  apiSpecificRenderWindow.setContainer(el);
  renderWindow.addView(apiSpecificRenderWindow);

  // create interactor and bind
  const interactor = vtkRenderWindowInteractor.newInstance();
  interactor.setInteractorStyle(
    vtkInteractorStyleTrackballCamera.newInstance()
  );

  interactor.setView(apiSpecificRenderWindow);
  interactor.initialize();
  interactor.bindEvents(el);

  apiSpecificRenderWindow.setSize(600, 600);

  return {
    renderWindow,
    renderer,
    interactor,
    apiSpecificRenderWindow,
  };
}

const components = createRenderWindow(document.getElementById("app"));
const { renderer, renderWindow } = components;

// create a cone
function createConePipeline() {
  const coneSource = vtkConeSource.newInstance();
  const actor = vtkActor.newInstance();
  const mapper = vtkMapper.newInstance();

  actor.setMapper(mapper);
  mapper.setInputConnection(coneSource.getOutputPort());

  renderer.addActor(actor);
  return { coneSource, mapper, actor };
}

const pipeline = createConePipeline();
pipeline.actor.getProperty().setColor(1, 0, 1);

// render
renderer.resetCamera();
renderWindow.render();

global.cone = pipeline.coneSource.getOutputData();
