import React from "react";
import styles from "./MainPage.module.css";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { Grid } from "@material-ui/core";
import { useQuery } from "@apollo/react-hooks";
import { useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";
import { GET_MYPROFILE, GET_PROFILES, UPDATE_PROFILE } from "../queries";

const MainPage = () => {
  const history = useHistory();
  const { data: dataMyProfile, error: errorMyProfile } = useQuery(
    GET_MYPROFILE,
    {
      fetchPolicy: "cache-and-network",
    }
  );
  const { data: dataProfiles, error: errorProfiles } = useQuery(GET_PROFILES, {
    fetchPolicy: "cache-and-network",
  });
  const [updateProfile] = useMutation(UPDATE_PROFILE);
  const myFollowings = dataMyProfile?.profile.followings.edges.map(
    ({ node }) => node.id
  );

  return (
    <div className={styles.mainPage__root}>
      {(errorMyProfile || errorProfiles) && (
        <h3>
          {errorProfiles?.message}/{errorMyProfile?.message}
        </h3>
      )}
      <Grid container>
        <Grid item xs>
          {dataMyProfile?.profile.userProf.username}
        </Grid>
        <Grid item xs>
          <span className={styles.mainPage__title}>Follow system </span>
        </Grid>
        <Grid item xs>
          <ExitToAppIcon
            className={styles.mainPage__out}
            onClick={() => {
              localStorage.removeItem("token");
              history.push("/");
            }}
          />
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={4}>
          <h3>Following</h3>
          <ul className={styles.mainPage__list}>
            {dataMyProfile?.profile.followings.edges.map(({ node }) => (
              <li className={styles.mainPage__item} key={node.id}>
                {node.username}
              </li>
            ))}
          </ul>
        </Grid>
        <Grid item xs={4}>
          <h3>Profile list</h3>
          <ul className={styles.mainPage__list}>
            {dataProfiles?.allProfiles.edges.map(
              ({ node }) =>
                node.id !== dataMyProfile?.profile.id && (
                  <li className={styles.mainPage__item} key={node.id}>
                    {node.userProf.username}
                    <button
                      onClick={
                        myFollowings?.includes(node.userProf.id)
                          ? () => {
                              updateProfile({
                                variables: {
                                  id: dataMyProfile?.profile.id,
                                  followings: myFollowings.filter(
                                    (followingId) =>
                                      followingId !== node.userProf.id
                                  ),
                                },
                              });
                            }
                          : () => {
                              updateProfile({
                                variables: {
                                  id: dataMyProfile?.profile.id,
                                  followings: [
                                    ...myFollowings,
                                    node.userProf.id,
                                  ],
                                },
                              });
                            }
                      }
                    >
                      {myFollowings?.includes(node.userProf.id)
                        ? "unfollow"
                        : "follow"}
                    </button>
                  </li>
                )
            )}
          </ul>
        </Grid>

        <Grid item xs={4}>
          <h3>Followers</h3>
          <ul className={styles.mainPage__list}>
            {dataMyProfile?.profile.userProf.profilesFollowings.edges.map(
              ({ node }) => (
                <li className={styles.mainPage__item} key={node.userProf.id}>
                  {node.userProf.username}
                </li>
              )
            )}
          </ul>
        </Grid>
      </Grid>
    </div>
  );
};

export default MainPage;
