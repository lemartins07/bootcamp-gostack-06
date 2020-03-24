import React, { Component } from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  Loading,
} from './styles';

export default class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stars: [],
      user: {},
      loading: true,
      page: 1,
    };
  }

  async componentDidMount() {
    this.load();
  }

  load = async (page = 1) => {
    const { route } = this.props;
    const { user } = route.params;
    const { stars } = this.state;

    try {
      const response = await api.get(`/users/${user.login}/starred`, {
        params: { page },
      });

      this.setState({
        stars: page >= 2 ? [...stars, ...response.data] : response.data,
        page,
        user,
        loading: false,
      });
    } catch (error) {
      console.tron.log(error);
    }
  };

  loadMore = async () => {
    const { page } = this.state;

    const nextPage = page + 1;

    this.load(nextPage);
  };

  render() {
    const { stars, user, loading } = this.state;

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        {loading ? (
          <Loading />
        ) : (
          <Stars
            data={stars}
            onEndReachedThreshold={0.2}
            onEndReached={this.loadMore}
            keyExtractor={(star) => String(star.id)}
            renderItem={({ item }) => (
              <Starred>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
      </Container>
    );
  }
}

User.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
  }).isRequired,
  route: PropTypes.shape().isRequired,
};
