import { Fragment, useEffect, useState } from "react";
import { getTasks } from "../../../services/TaskServices";
import {
    Button,
    Col,
    Container,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row,
    Table,
    UncontrolledDropdown,
} from "reactstrap";
import { Task } from "../../../shared/schemas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheck,
    faEllipsisH,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { InfinitySpin } from "react-loader-spinner";
import styles from "./TaskList.module.scss";
import TaskView from "../TaskView/TaskView";

interface TaskListProps { }

const TaskList = (props: TaskListProps) => {
    const [data, setData] = useState<Task[]>([]);
    const [listLoading, setListLoading] = useState<boolean>(false);
    const [selectedTaskId, setSelectedTaskId] = useState<number>(0);

    const [viewModalToggle, setViewModalToggle] = useState<boolean>(false)

    useEffect(() => {
        setListLoading(true);
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await getTasks();
            setData(data);
        } catch (error) {
            console.error("Error fetching message:", error);
        }
        setListLoading(false);
    };

    const taskStatusIcon = (status: boolean) => {
        if (status) {
            return faCheck;
        } else {
            return faXmark;
        }
    };

    const toggleViewFunction = () => {
        setViewModalToggle(!viewModalToggle)
    }

    const renderTable = () => {
        return (
            <Fragment>
                <Table striped>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Task</th>
                            <th>Completed</th>
                            <th>Created At</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((task: Task, index: number) => {
                            return (
                                <tr key={`record_${index}`}>
                                    <td>{index + 1}</td>
                                    <td>{task.title}</td>
                                    <td>
                                        <FontAwesomeIcon icon={taskStatusIcon(task.completed)} />
                                    </td>
                                    <td>{task.created_at}</td>
                                    <td>
                                        <UncontrolledDropdown>
                                            <DropdownToggle color="light">
                                                <FontAwesomeIcon icon={faEllipsisH} />
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem
                                                    onClick={() => {
                                                        setSelectedTaskId(task.id)
                                                        toggleViewFunction()
                                                    }}
                                                >
                                                    View
                                                </DropdownItem>
                                                <DropdownItem
                                                    onClick={() => {
                                                        setSelectedTaskId(task.id)
                                                        toggleViewFunction()
                                                    }}
                                                >
                                                    Edit
                                                </DropdownItem>
                                                <DropdownItem className={styles.danger}
                                                    onClick={() => {
                                                        setSelectedTaskId(task.id)
                                                        toggleViewFunction()
                                                    }}
                                                >Delete</DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
                <Modal isOpen={viewModalToggle} toggle={toggleViewFunction}>
                    <ModalHeader toggle={toggleViewFunction}>Task Details</ModalHeader>
                    <ModalBody>
                        <TaskView id={selectedTaskId} />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={toggleViewFunction}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
            </Fragment>
        );
    };

    return (
        <Fragment>
            <Row className={styles.headerBtn}>
                <Col md={1}>
                    <Button
                        color="primary"
                        onClick={()=>{
                            console.log("first")
                        }}
                    >
                            Add Task
                    </Button>
                </Col>
            </Row>
            <div className={styles.container}>
                {listLoading ? (
                    <InfinitySpin width="200" color="#000000" />
                ) : (
                    renderTable()
                )}
            </div>
        </Fragment>
    );
};

export default TaskList;
