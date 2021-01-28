import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { Card, Header, Tab, Image, Button, Grid } from 'semantic-ui-react';
import PhotoUploadWidget from '../../app/api/common/photoUpload/PhotoUploadWidget';
import { RootStoreContext } from '../../app/stores/rootStore';

const ProfilePhotos = () => {
    const rootStore = useContext(RootStoreContext);
    const { profile, isCurrentUser, uploadPhoto, uploadingPhoto , setMainPhoto,loading, deletePhoto} = rootStore.profileStore;
    const [addPhotoMode, setAddPhotoMode] = useState(false);
    const [target, setTarget] = useState<string | undefined>(undefined);
    const [deleteTarget, setDeleteTarget] = useState<string | undefined>(undefined);

    const handleUploadImage = (photo: Blob) => {
        uploadPhoto(photo).then(() => setAddPhotoMode(false))
    }

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16} style={{ paddingBottom: 0 }}>
                    <Header floated='left' icone='image' content='Photos' />
                    {isCurrentUser &&
                        <Button floated='right'
                            basic
                            content={addPhotoMode ? 'Cancel' : 'Add Photo'}
                            onClick={() => setAddPhotoMode(!addPhotoMode)} />}
                </Grid.Column>
                <Grid.Column width={16}>
                    {addPhotoMode ? (
                        <PhotoUploadWidget uploadPhoto={handleUploadImage} loading={uploadingPhoto} />
                    ) : (
                            <Card.Group itemsPerRow={5}>
                                {profile && profile?.photos.map((photo) => (
                                    <Card key={photo.id}>
                                        <Image src={photo.url} />
                                        {isCurrentUser && (
                                            <Button.Group fluid widths={2}>
                                                <Button 
                                                name={photo.id} 
                                                basic 
                                                loading={loading && target === photo.id} 
                                                onClick={(e) => {
                                                    setTarget(e.currentTarget.name)
                                                    setMainPhoto(photo)}} 
                                                disabled = {photo.isMain}
                                                positive 
                                                content='Main' />
                                                <Button 
                                                name={photo.id}
                                                disabled = {photo.isMain}
                                                onClick={(e) => {
                                                    setDeleteTarget(e.currentTarget.name)
                                                    deletePhoto(photo)
                                                }}
                                                loading={loading && deleteTarget === photo.id}
                                                basic 
                                                negative 
                                                icon='trash' />
                                            </Button.Group>
                                        )
                                        }
                                    </Card>
                                ))}
                            </Card.Group>
                        )}
                </Grid.Column>
            </Grid>


        </Tab.Pane>
    );
};
export default observer(ProfilePhotos)