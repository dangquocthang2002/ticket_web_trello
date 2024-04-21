import { Button, Form, Input, Modal } from "antd";
import { apiUser } from "api";
import { addNewUser } from "modules/users/users.action";
import { connect } from "react-redux";
import { toastError } from "utils/toastHelper";
const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 32 },
};
const formItemLayout = {
    labelCol: {
        xs: { span: 12 },
        sm: { span: 7 },
    },
};
/* eslint-disable no-template-curly-in-string */
const validateMessages = {
    required: '${label} is required!',
    types: {
        email: '${label} is not a valid email!',
        number: '${label} is not a valid number!',
    },
    number: {
        range: '${label} must be between ${min} and ${max}',
    },
};

const AddUserModal = ({ open, handleCancel, addNewUser }) => {
    const onFinish = async (values) => {
        await apiUser.addNewUserAPI({
            ...values.user,
            password: values.password
        }).then((res) => {
            addNewUser(res?.data);
            handleCancel();
        }).catch((error) => {
            toastError();
        })
    };
    return (
        <Modal title="Add User" open={open} footer={""} onCancel={handleCancel}>
            <Form
                {...formItemLayout}
                name="nest-messages"
                onFinish={onFinish}
                style={{ maxWidth: 600 }}
                validateMessages={validateMessages}
            >
                <Form.Item name={['user', 'name']} label="Name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name={['user', 'username']} label="User Name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name={['user', 'email']} label="Email" rules={[{ type: 'email', required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    name={'password'}

                    label="Password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="Confirm Password"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The new password that you entered do not match!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 20 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Modal>

    );
};
const mapStateToProps = (state) => ({
    users: state.users.listUsers,
    isAdmin: state.users.isAdmin,
});
const mapDispatchToProps = {
    addNewUser
};
export default connect(mapStateToProps, mapDispatchToProps)(AddUserModal);
