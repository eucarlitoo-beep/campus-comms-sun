REVOKE ALL ON FUNCTION public.is_workspace_member(UUID, UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_workspace_admin(UUID, UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_workspace_member(UUID, UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.is_workspace_admin(UUID, UUID) TO service_role;