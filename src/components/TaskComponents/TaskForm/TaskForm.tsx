import { Button, Container, FormGroup, Label, Input, FormFeedback } from 'reactstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import TopSection from '../../sharedComponents/TopSection/TopSection';
import { Task } from '../../../shared/schemas';

interface TaskFormProps {

}


const TaskForm = (props: TaskFormProps) => {

  const initialValues: Task = {
    id: 0,
    title: "",
    description: "",
    completed: false,
    created_at: "",
    updated_at: ""
  };

  const validationSchema = Yup.object({
    title: Yup.string()
      .required('Title is required')
      .min(3, 'Title must be at least 3 characters'),
    description: Yup.string()
      .required('Description is required')
      .min(5, 'Description must be at least 5 characters'),
  });

  const onSubmit = (values: Task) => {
    console.log('Form values:', values);
  };

  return (
    <Container fluid className='p-0'>
      <TopSection
        onBack='/'
      />
      <div className='mx-3'>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ errors, touched }) => (
            <FormikForm>
              <FormGroup>
                <Label for="title">Title</Label>
                <Field
                  name="title"
                  as={Input}
                  type="text"
                  invalid={!!(errors.title && touched.title)}
                />
                <ErrorMessage name="title" component={FormFeedback} />
              </FormGroup>

              <FormGroup>
                <Label for="description">Description</Label>
                <Field
                  name="description"
                  as={Input}
                  type="textarea"
                  invalid={!!(errors.description && touched.description)}
                />
                <ErrorMessage name="description" component={FormFeedback} />
              </FormGroup>

              <Button type="submit" color="primary">
                Submit
              </Button>
            </FormikForm>
          )}
        </Formik>
      </div>
    </Container>
  );
};

export default TaskForm;
