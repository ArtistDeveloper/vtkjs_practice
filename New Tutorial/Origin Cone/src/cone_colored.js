import "@kitware/vtk.js/Rendering/Profiles/Geometry";
import "@kitware/vtk.js/Rendering/Misc/RenderingAPIs"

import vtkRenderWindow from "@kitware/vtk.js/Rendering/Core/RenderWindow";
import vtkRenderer from "@kitware/vtk.js/Rendering/Core/Renderer";
import vtkRenderWindowInteractor from "@kitware/vtk.js/Rendering/Core/RenderWindowInteractor";


function createRenderWindow(e1) {
    const renderWindow = vtkRenderWindow.newInstance();
    const renderer = vtkRenderer.newInstance();

    renderWindow.addRenderer(renderer);

    // picks webgl or webgpu
    const apiSpecificRenderWindow = renderWindow.newAPISpecificView();
    apiSpecificRenderWindow.setContainer(e1);
    renderWindow.addview(apiSpecificRenderWindow);

    // create interactor and bind
    const interactor = vtkRenderWindowInteractor.newInstance();
}

