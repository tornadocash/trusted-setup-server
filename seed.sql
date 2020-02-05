create table contributions
(
    id int auto_increment,
    token varchar(64) not null,
    name varchar(255) null,
    company varchar(255) null,
    handle varchar(255) null,
    socialType varchar(255) not null,
    hash varchar(130) null,

    constraint contributions_pk
        primary key (id)
);

create unique index contributions_token_uindex on contributions (token);
