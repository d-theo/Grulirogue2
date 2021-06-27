import * as _ from 'lodash';
import { createGraph } from '../map_definition';
import { rand, randomPointOfEdge } from '../map-geo';

export function generateUnitMap() {
    const graph = createGraph();
    const hallway = {
        x: 10,
        y: 20,
        width: 8,
        height: 8
    };

    graph.addRoom({
        roomId: 1,
        groupId: rand(0, 999),
        rect: hallway,
        isEntry: false,
        isExit: false
    });
    
    return graph.generate();
}