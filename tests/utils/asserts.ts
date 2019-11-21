import * as _chai from "chai";
import * as ts from "typescript";

const assert: typeof _chai.assert = _chai.assert;

export function assertStructuralEquals(node1: ts.Node, node2: ts.Node) {
    if (node1 === node2) {
        return;
    }

    assert(node1, "node1");
    assert(node2, "node2");
    if (!ts.isSourceFile(node1)) {
        // assert.equal(node1.pos, node2.pos, "node1.pos !== node2.pos");
        // assert.equal(node1.end, node2.end, "node1.end !== node2.end");
        assert.equal(node1.kind, node2.kind, "node1.kind !== node2.kind");
        // tslint:disable-next-line:no-bitwise
        assert.equal(node1.flags & ~ts.NodeFlags.ReachabilityAndEmitFlags & ~ts.NodeFlags.Synthesized, node2.flags & ~ts.NodeFlags.Synthesized & ~ts.NodeFlags.ReachabilityAndEmitFlags, "node1.flags !== node2.flags");

    }


    // call this on both nodes to ensure all propagated flags have been set (and thus can be
    // compared).
    // @ts-ignore
    assert.equal(ts.containsParseError(node1), ts.containsParseError(node2));

    ts.forEachChild(node1,
        (child1: any) => {
            const childName = findChildName(node1, child1);
            const child2: ts.Node = (node2 as any)[childName];

            assertStructuralEquals(child1, child2);
        },
        (array1: any) => {
            const childName = findChildName(node1, array1);
            const array2: ts.NodeArray<ts.Node> = (node2 as any)[childName];

            assertArrayStructuralEquals(array1, array2);
        });
}

function assertArrayStructuralEquals(array1: ts.NodeArray<ts.Node>, array2: ts.NodeArray<ts.Node>) {
    if (array1 === array2) {
        return;
    }

    assert(array1, "array1");
    assert(array2, "array2");
    // assert.equal(array1.pos, array2.pos, "array1.pos !== array2.pos");
    // assert.equal(array1.end, array2.end, "array1.end !== array2.end");
    assert.equal(array1.length, array2.length, "array1.length !== array2.length");

    for (let i = 0; i < array1.length; i++) {
        assertStructuralEquals(array1[i], array2[i]);
    }
}

function findChildName(parent: any, child: any) {
        for (const name in parent) {
            if (parent.hasOwnProperty(name) && parent[name] === child) {
                return name;
            }
        }

        throw new Error("Could not find child in parent");
}
