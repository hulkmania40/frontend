import React, { Fragment, useEffect, useState } from "react";
import { Row, Col, Label } from "reactstrap";
import { getTask } from "../../../services/TaskServices";
import { Task } from "../../../shared/schemas";
import { InfinitySpin } from "react-loader-spinner";
import styles from './TaskView.module.scss'

interface TaskViewProps {
    id: number;
}

const TaskView = (props: TaskViewProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [taskDetails, setTaskDetails] = useState<Task>();

    useEffect(() => {
        setLoading(true);
        fetchViewData(props.id);
    }, [props.id]);

    const fetchViewData = async (id: number) => {
        const data = await getTask(id);
        setTaskDetails(data);
        setLoading(false);
    };

    return loading ? (
        <InfinitySpin width="200" color="#000000" />
    ) : (
        <div className={styles.container}>
            <Row>
                <Col md={6}>
                    <Label>ID</Label>
                    <div>{taskDetails?.id}</div>
                </Col>
                <Col md={6}>
                    <Label>Task</Label>
                    <div>{taskDetails?.title}</div>
                </Col>
            </Row>
            <hr />
            <Row>
                <Col md={12}>
                    <Label>Description</Label>
                    <div>{taskDetails?.description}</div>
                </Col>
            </Row>
            <hr />
            <Row>
                <Col md={6}>
                    <Label>Created At</Label>
                    <div>{taskDetails?.created_at}</div>
                </Col>
                <Col md={6}>
                    <Label>Updated At</Label>
                    <div>{taskDetails?.updated_at}</div>
                </Col>
            </Row>
        </div>
    );
};

export default TaskView;
