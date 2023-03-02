import "@kitware/vtk.js/Rendering/Profiles/Geometry";
import "@kitware/vtk.js/Rendering/Misc/RenderingAPIs";

import vtkActor from "@kitware/vtk.js/Rendering/Core/Actor";
import vtkConeSource from "@kitware/vtk.js/Filters/Sources/ConeSource";
import vtkMapper from "@kitware/vtk.js/Rendering/Core/Mapper";
import vtkRenderer from "@kitware/vtk.js/Rendering/Core/Renderer";
import vtkRenderWindow from "@kitware/vtk.js/Rendering/Core/RenderWindow";
import vtkRenderWindowInteractor from "@kitware/vtk.js/Rendering/Core/RenderWindowInteractor";
import vtkInteractorStyleTrackballCamera from "@kitware/vtk.js/Interaction/Style/InteractorStyleTrackballCamera";
import vtkColorTransferFunction from "@kitware/vtk.js/Rendering/Core/ColorTransferFunction";
import vtkDataArray from "@kitware/vtk.js/Common/Core/DataArray";

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
        apiSpecificRenderWindow
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

function randomizePointData(cone) {
    // set random scalars on each point
    const numPoints = cone.getPoints().getNumberOfTuples();
    const scalars = new Float32Array(numPoints);
    for (let i = 0; i < numPoints; i++) {
        scalars[i] = i / numPoints;
    }
    const dataArray = vtkDataArray.newInstance({
        numberOfComponents: 1,
        values: scalars
    });
    cone.getPointData().setScalars(dataArray);
}

function randomizeCellData(cone) {
    // set random scalars on each face
    const numCells = cone.getPolys().getNumberOfCells();
    const scalars = new Float32Array(numCells);
    for (let i = 0; i < numCells; i++) {
        scalars[i] = i / numCells;
    }
    const dataArray = vtkDataArray.newInstance({
        numberOfComponents: 1,
        values: scalars
    });
    cone.getCellData().setScalars(dataArray);
}

// use color lookup function
function applyColorTransferFunction(mapper, interpolate) {
    const lut = vtkColorTransferFunction.newInstance();
    lut.setUseBelowRangeColor(true);
    lut.setUseAboveRangeColor(true);
    lut.addRGBPoint(0.0, 0.2, 0.2, 1.0);
    lut.addRGBPoint(0.5, 0.2, 1.0, 0.2);
    lut.addRGBPoint(0.75, 1.0, 1.0, 1.0);
    lut.addRGBPoint(1.0, 1.0, 0.2, 0.2);

    mapper.setLookupTable(lut);
    mapper.setInterpolateScalarsBeforeMapping(interpolate);
    mapper.setUseLookupTableScalarRange(true);
}

const pipeline = createConePipeline();
const cone = pipeline.coneSource.getOutputData();

randomizePointData(cone);
randomizeCellData(cone);
applyColorTransferFunction(
    pipeline.mapper,
    false // interpolate before mapping colors?
);
//
pipeline.mapper.setScalarModeToUsePointData();
//pipeline.mapper.setScalarModeToUseCellData();

// render
renderer.resetCamera();
renderWindow.render();

global.mapper = pipeline.mapper;
global.cone = cone;
