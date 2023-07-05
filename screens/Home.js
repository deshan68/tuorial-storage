import { FlatList, Image, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import EmptyState from "../components/EmptyState";
import Uploading from "../components/Uploading";
import { Feather } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { db, storage } from "../firebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "@firebase/storage";
import { addDoc, collection, getDocs, onSnapshot } from "@firebase/firestore";
import { Video } from "expo-av";
import { SafeAreaView } from "react-native";

const Home = () => {
  const [image, setImage] = useState();
  const [video, setVideo] = useState();
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [uploadTask, setUploadTask] = useState();

  const tempFile = [
    {
      createdAt: "2023-07-04T19:19:07.134Z",
      fileType: "image",
      url: "https://firebasestorage.googleapis.com/v0/b/storage-2-expo.appspot.com/o/Stuff%2F1688498336709?alt=media&token=7651b8a9-109f-4316-8d42-af2b825ee577",
    },
  ];

  async function GetData() {
    const querySnapshot = await getDocs(collection(db, "files"));
    const file = [];
    querySnapshot.forEach((doc) => {
      const { createdAt, fileType, url } = doc.data();
      file.push({
        createdAt,
        fileType,
        url,
      });
    });
    setFiles(file);
    setIsLoading(false);
  }

  useEffect(() => {
    GetData();
    // const unsubscribe = onSnapshot(collection(db, "files"), (snapshot) => {
    //   // listen to changes in the collection in firestore
    //   snapshot.forEach((doc) => {
    //     setFiles(doc.data());
    //     // if (change.type === "added") {
    //     //   // if a new file is added, add it to the state
    //     //   console.log("New file", change.doc.data());
    //     //   setFiles((prevFiles) => [...prevFiles, change.doc.data()]);
    //     //   setIsLoading(false);
    //     // }
    //   });
    // });
    // return () => unsubscribe();
    // It is a good practice to unsubscribe to the listener when unmounting.
    // Because if you don't, you will have a memory leak.
  }, [image, video]);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.2,
      allowsMultipleSelection: false,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      console.log(result.assets[0].fileSize / (1024 * 1024));
      await uploadImage(result.assets[0].uri, "image");
    }
  };

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.4,
      allowsMultipleSelection: false,
      videoQuality:
        ImagePicker.UIImagePickerControllerQualityType.IFrame960x540,
    });

    if (!result.canceled) {
      setVideo(result.assets[0].uri);
      console.log(result.assets[0].fileSize / (1024 * 1024));
      await uploadImage(result.assets[0].uri, "video");
    }
  };

  const uploadImage = async (uri, fileType) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(storage, "Stuff/" + new Date().getTime());
    const _uploadTask = uploadBytesResumable(storageRef, blob);
    setUploadTask(_uploadTask);

    //listen for event
    _uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Progress: " + progress.toFixed(2) + "% done");
        setProgress(progress.toFixed(2));
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          console.log("File available at : ", downloadURL);
          //save records
          await saveRecord(fileType, downloadURL, new Date().toISOString());
          setImage("");
          setVideo("");
        });
      }
    );
  };

  async function saveRecord(fileType, url, createdAt) {
    try {
      const docRef = await addDoc(collection(db, "files"), {
        fileType,
        url,
        createdAt,
      });
      console.log("document saved correctly", docRef.id);
    } catch (e) {
      console.log(e);
    }
  }

  const uploadCancelHandler = () => {
    setUploadTask((prev) => {
      return prev.cancel();
    });
    setUploadTask("");
    setImage("");
    setVideo("");
    alert("upload canceled");
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {!isLoading ? (
        <View style={{ flex: 1, flexDirection: "row" }}>
          <FlatList
            numColumns={4}
            contentContainerStyle={{
              gap: 2,
            }}
            columnWrapperStyle={{
              gap: 2,
            }}
            data={files}
            keyExtractor={(item) => item.createdAt}
            renderItem={({ item }) => {
              if (item.fileType === "image") {
                return (
                  <Image
                    source={{ uri: item.url }}
                    style={{ width: "25%", height: 100, resizeMode: "cover" }}
                  />
                );
              } else {
                return (
                  <Video
                    source={{ uri: item.url }}
                    videoStyle={{}}
                    rate={1.0}
                    volume={1.0}
                    isMuted={false}
                    resizeMode="cover"
                    style={{ width: "25%", height: 100 }}
                  />
                );
              }
            }}
          />
        </View>
      ) : (
        <EmptyState />
      )}

      {/* video picker button */}
      <TouchableOpacity
        onPress={pickVideo}
        style={{
          position: "absolute",
          bottom: 90,
          right: 30,
          height: 44,
          width: 44,
          backgroundColor: "black",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 25,
        }}
      >
        <Feather name="video" size={24} color="white" />
      </TouchableOpacity>
      {/* image picker button */}
      <TouchableOpacity
        onPress={pickImage}
        style={{
          position: "absolute",
          bottom: 40,
          right: 30,
          height: 44,
          width: 44,
          backgroundColor: "black",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 25,
        }}
      >
        <Foundation name="photo" size={24} color="white" />
      </TouchableOpacity>
      {image || video ? (
        <Uploading
          image={image}
          video={video}
          progress={progress}
          uploadCancelHandler={uploadCancelHandler}
        />
      ) : null}
    </SafeAreaView>
  );
};

export default Home;
