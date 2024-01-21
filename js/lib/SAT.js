export function isColliding(points1, points2){
    const edges = [...buildEdges(points1), ...buildEdges(points2)];

    // build all axis and project
    for (let i = 0; i < edges.length; i++) {
        // get axis
        const length = Math.sqrt(edges[i].y * edges[i].y + edges[i].x * edges[i].x);
        const axis = {
            x: -edges[i].y / length,
            y: edges[i].x / length,
        };
        // project poly1 under axis
        const { min: minA, max: maxA } = projectInAxis(points1,axis.x, axis.y);
        const { min: minB, max: maxB } = projectInAxis(points2,axis.x, axis.y);
        if (intervalDistance(minA, maxA, minB, maxB) > 0) {
            return false;
        }
    }
    return true;
}

// return [{x,y}]
function buildEdges(vertices) {
    const edges = [];
    if (vertices.length < 3) {
        console.error("Only polygons supported.");
        return edges;
    }
    for (let i = 0; i < vertices.length; i++) {
        const a = vertices[i];
        let b = vertices[0];
        if (i + 1 < vertices.length) {
            b = vertices[i + 1];
        }

        let [ax,ay]=a;
        let [bx,by]=b;

        edges.push({
            x: (bx - ax),
            y: (by - ay),
        });
    }
    return edges;
}

function intervalDistance(minA, maxA, minB, maxB) {
    if (minA < minB) {
        return (minB - maxA);
    }
    return (minA - maxB);
}

function projectInAxis (vertices=[[]], x, y) {
    let min = Infinity;
    let max = -Infinity;
    for (let i = 0; i < vertices.length; i++) {
        // let px = vertices[i].x;
        // let py = vertices[i].y;
        let [px,py] = vertices[i]
        var projection = (px * x + py * y) / (Math.sqrt(x * x + y * y));
        if (projection > max) {
            max = projection;
        }
        if (projection < min) {
            min = projection;
        }
    }
    return { min, max };
};