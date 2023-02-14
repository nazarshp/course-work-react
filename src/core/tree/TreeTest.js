import Tree, { Node, TreeLogger }  from './Tree';

export default class TreeTest {

    run() {
        var t1 = new Tree();

        t1.insert('test1', 1);
        t1.insert('test2', 2);
        t1.insert('test3', 3);
        //t1.print();

        t1.logger.printJob('test1')
        t1.logger.printJob('test2')
        t1.logger.printJob('test3')

    }
}


