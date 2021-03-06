using System.Collections.Generic;
using MediatR;
using Domain;
using System.Threading.Tasks;
using System.Threading;
using Persistence;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using System.Linq;
using System;
using Application.Interfaces;

namespace Application.Activities
{
    public class List
    {
        public class ActivitiesEnvelope
        {
            public List<ActivityDto> Activities { get; set; }
            public int ActivityCount { get; set; }
        }
        public class Query : IRequest<ActivitiesEnvelope>
        {
            public Query(int? limit, int? offset, bool isGoing, bool isHost, DateTime startDate)
            {
                Limit = limit;
                Offset = offset;
                IsGoing = isGoing;
                IsHost = isHost;
               startDate = DateTime.Now;
               
            }
            public int? Limit { get; set; }
            public int? Offset { get; set; }
            public bool IsGoing { get; set; }
            public bool IsHost { get; set; }
            public DateTime StartDate { get; set; }
        }

        public class Handler : IRequestHandler<Query, ActivitiesEnvelope>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _context = context;
            }

            public async Task<ActivitiesEnvelope> Handle(Query request, CancellationToken cancellationToken)
            {
                var queryable = _context.Activities
               // .Where(x => x.Date >= DateTime.Parse(request.StartDate))
              // .Where(x => DateTime.ParseExact( x.Date.Time.ToString("dd/MM/yyyy HH:mm:ss.fff"), "dd/MM/yyyy HH:mm:ss.fff", System.Globalization.CultureInfo.CurrentCulture) >= DateTime.ParseExact(request.StartDate.ToString("dd/MM/yyyy HH:mm:ss.fff"), "dd/MM/yyyy HH:mm:ss.fff", System.Globalization.CultureInfo.CurrentCulture))
               .Where(x =>  x.Date.Date >= request.StartDate.Date)
               .OrderBy(x => x.Date)
                .AsQueryable();


                if (request.IsGoing && !request.IsHost)
                {
                    queryable = queryable.Where(x => x.UserActivities.Any(a => a.AppUser.UserName == _userAccessor.getCurrentUserName()));
                }
                if (!request.IsGoing && request.IsHost)
                {
                    queryable = queryable.Where(x => x.UserActivities.Any(a => a.AppUser.UserName == _userAccessor.getCurrentUserName() && a.IsHost));
                }

                var activities = await queryable.Skip(request.Offset ?? 0).Take(request.Limit ?? 3).ToListAsync();

                return new ActivitiesEnvelope
                {
                    Activities = _mapper.Map<List<Activity>, List<ActivityDto>>(activities),
                    ActivityCount = queryable.Count()
                };
            }
        }
    }
}