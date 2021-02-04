import React from 'react';
import { combineValidators, isRequired } from 'revalidate';
import { Button, Form } from 'semantic-ui-react';
import { IProfile } from '../../app/models/profile';
import { Form as FinalForm, Field } from 'react-final-form'
import TextInput from '../../app/api/common/form/TextInput';
import TextAreaInput from '../../app/api/common/form/TextAreaInput';
import { observer } from 'mobx-react-lite';

const validate = combineValidators({
    displayName: isRequired('displayName')
});

interface IProp {
    updateProfile: (profile: IProfile) => void;
    profile: IProfile;
}
const ProfileEditForm: React.FC<IProp> = ({ updateProfile, profile }) => {
    return (
        <FinalForm onSubmit={updateProfile} validate={validate} initialValues={profile!}
            render={({ handleSubmit, invalid, pristine, submitting }) => (
                <Form onSubmit={handleSubmit} error>
                    <Field name='displayName' component={TextInput} placeholder='Display Name' value={profile!.displayName} />
                    <Field name='bio' component={TextAreaInput} rows={3} placeholder='Bio' value={profile!.bio} />
                    <Button loading={submitting} floated='right' disabled={invalid || pristine} positive content='Update profile'/>
                </Form>
            )}>
            <Form />
        </FinalForm>
    )
};


export default observer(ProfileEditForm)