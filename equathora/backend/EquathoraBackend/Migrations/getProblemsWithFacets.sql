create or replace function public.get_problems_with_facets(
  p_user_id uuid default null,
  p_page integer default null,
  p_page_size integer default null,
  p_problem_id bigint default null,
  p_group_id bigint default null,
  p_slug text default null,
  p_difficulties text[] default null,
  p_topics text[] default null,
  p_grades text[] default null,
  p_search_term text default null,
  p_sort text default null,
  p_progress text[] default null,
  p_completed boolean default null
)
returns jsonb
language sql
stable
as $$
with base as (
  select
    p.*,

    exists (
      select 1
      from user_completed_problems ucp
      where CAST(ucp.problem_id_int AS INTEGER) = p.id
        and ucp.user_id = p_user_id   
    ) as completed,

    exists (
      select 1
      from user_favorites uf
      where uf.problem_id = p.id
        and uf.user_id = p_user_id
    ) as favorite

  from problems p
  where p.is_active = true
    and (p_problem_id is null or p.id = p_problem_id)
    and (p_group_id is null or p.group_id = p_group_id)
    and (p_slug is null or p.slug = p_slug)

    and (
      p_grades is null
      or array_length(p_grades, 1) is null
      or (p.grade is not null and lower(trim(p.grade)) = any(array(select lower(trim(x)) from unnest(p_grades) as x)))
    )

    and (
      p_difficulties is null
      or array_length(p_difficulties, 1) is null
      or lower(trim(p.difficulty)) = any(array(select lower(trim(x)) from unnest(p_difficulties) as x))
    )
    and (
      p_topics is null
      or array_length(p_topics, 1) is null
      or lower(trim(p.topic)) = any(array(select lower(trim(x)) from unnest(p_topics) as x))
    )
    and (
      p_search_term is null
      or trim(p_search_term) = ''
      or p.title ilike '%' || p_search_term || '%'
      or p.slug ilike '%' || p_search_term || '%'
    )
),

filtered as (
  select *
  from base b
  where
    p_completed is null
    or b.completed = p_completed
),

ordered as (
  select *
  from filtered
  order by
    case when p_sort = 'title-asc' then title end asc nulls last,
    case when p_sort = 'title-desc' then title end desc nulls last,
    case when p_sort in ('difficulty-asc', 'difficulty_asc') then
      case lower(trim(difficulty))
        when 'beginner' then 0
        when 'easy' then 1
        when 'standard' then 2
        when 'intermediate' then 3
        when 'medium' then 4
        when 'challenging' then 5
        when 'hard' then 6
        when 'advanced' then 7
        when 'expert' then 8
        else 999
      end
    end asc nulls last,
    case when p_sort in ('difficulty-desc', 'difficulty_desc') then
      case lower(trim(difficulty))
        when 'beginner' then 0
        when 'easy' then 1
        when 'standard' then 2
        when 'intermediate' then 3
        when 'medium' then 4
        when 'challenging' then 5
        when 'hard' then 6
        when 'advanced' then 7
        when 'expert' then 8
        else 999
      end
    end desc nulls last,
    case when p_sort = 'newest' then created_at end desc nulls last,
    case when p_sort = 'oldest' then created_at end asc nulls last,
    id asc
),

paged as (
  select *
  from ordered
  offset coalesce((p_page - 1) * p_page_size, 0)
  limit coalesce(p_page_size, 1000000)
),

difficulty_facets as (
  select coalesce(jsonb_object_agg(difficulty, cnt), '{}'::jsonb) as value
  from (
    select difficulty, count(*) as cnt
    from filtered
    where difficulty is not null
    group by difficulty
  ) x
),


topic_facets as (
  select coalesce(jsonb_object_agg(topic, cnt), '{}'::jsonb) as value
  from (
    select topic, count(*) as cnt
    from filtered
    where topic is not null
    group by topic
  ) x
),


grade_facets as (
  select coalesce(jsonb_object_agg(grade, cnt), '{}'::jsonb) as value
  from (
    select
      grade,
      count(*) as cnt
    from filtered
    where grade is not null and trim(grade) <> ''
    group by grade
  ) x
),

progress_facets as (
  select jsonb_build_object(
    'completed', (select count(*) from filtered where completed = true),
    'favorite', (select count(*) from filtered where favorite = true)
  ) as value
)

select jsonb_build_object(
  'data',
  coalesce((select jsonb_agg(to_jsonb(paged)) from paged), '[]'::jsonb),
  'count',
  (select count(*) from filtered),
  'page',
  p_page,
  'pageSize',
  p_page_size,
  'facets',
  jsonb_build_object(
    'difficulty', (select value from difficulty_facets),
    'topic', (select value from topic_facets),
    'grade', (select value from grade_facets),
    'progress', (select value from progress_facets)
  )
);
$$;